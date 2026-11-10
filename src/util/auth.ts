import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { logInUser } from "@/actions/logInUser";
import { JWT } from "next-auth/jwt";
import { logInUserGoogle } from "@/actions/logInUserGoogle";
import getSessionUserInfo from "@/actions/getSessionUserInfo";
import { pool } from "@/util/postgres";

/**
 * This file controls the authentication process of the app, both for Google and for the credentials (username and password)
*/
export const authOptions: AuthOptions = {

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  ),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userNameLogIn: { label: "User name", type: "text" },
        passwordLogIn: { label: "Password", type: "password" },
        trigger: { label: "Type of the trigger", type: "text" }
      },

      async authorize(credentials, req) {
        // We check that the credentials are not undefined
        let userLoggingIn:any = null
        let user = { id: "", name: "" }

        if (credentials?.userNameLogIn !== undefined && credentials?.passwordLogIn !== undefined) {
          // Here we check if the user exists in the database
          userLoggingIn = await logInUser(credentials.userNameLogIn, credentials.passwordLogIn);
          user = { id: userLoggingIn?.userIdLogged, name: userLoggingIn?.userNameLogged }
          
          if(userLoggingIn?.error) {
            // When returning null, next-auth will return an error
            return null;
          }
        }
        else if (credentials?.trigger === "updateUser") {
          // Refreshes the session after changing the user name in Settings.
          // It requires the current session and reads the user by its id: the user name sent by the client
          // is NOT trusted, otherwise anyone could log in as any user without a password
          userLoggingIn = await getSessionUserInfo();

          if (!userLoggingIn || userLoggingIn.length === 0) {
            // When returning null, next-auth will return an error
            return null;
          }
          user = { id: userLoggingIn[0].user_id, name: userLoggingIn[0].user_name }
        }
        else {
          return null;
        }

        // If the user is successfully logged in, we create the session with the user data (userId and userName)
        return user;
      }
    })
  ],
  callbacks: {
    // Here we add the id field to the JWT token
    async jwt({ token, user, session, trigger }:{ token:JWT, user:any, session?:any, trigger?:"signIn" | "update" | "signUp" | undefined }) {
      if (user?.id) {
        token.id = user.id
        token.isNewUser = user.isNewUser
      }
      if (trigger === "update" && token.id) {
          // The new name is read from the database, the one sent by the client (session.name) is not trusted
          const { rows } = await pool.query(`SELECT user_name FROM users WHERE user_id = $1`, [token.id]);
          if (rows[0]?.user_name) {
            token.name = rows[0].user_name;
          }
          token.isNewUser = false; // If we are updating the user, it means that the user is no longer new
      }
     
      return token
    },
    // And here we add the id field from the token to the session, so we can access it in the client side with useSession
    async session({ session, token }:{ session:any, token:JWT }) {
      if (session.user) {
        session.user.id = token.id,
        session.user.name = token.name,
        session.user.isNewUser = token.isNewUser
      }

      return session
    },
    async signIn({ user, account, profile }:any) {
      if (account?.provider === "google") {
        // Google tells us if the email has been verified, needed to link it to an existing account with the same email
        let userResult = await logInUserGoogle(user.id, user.email, profile?.email_verified === true)
        // If the Google login failed (DB error, etc.) we don't let the user in
        if (!userResult) {
          return false
        }

        user.id = userResult.userId
        user.name = userResult.userName
        user.isNewUser = false

        if(userResult.isNewUser) {
          user.isNewUser = true
        }
      }
      return true
    },
  }
};
import NextAuth, { Account, AuthOptions, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { logInUser } from "@/actions/logInUser";
import { JWT } from "next-auth/jwt";
import { logInUserGoogle } from "@/actions/logInUserGoogle";

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
      },

      async authorize(credentials, req) {
        // We check that the credentials are not undefined
        let userLoggingIn:any = null

        if (credentials?.userNameLogIn !== undefined && credentials?.passwordLogIn !== undefined) {
          // Here we check if the user exists in the database
          userLoggingIn = await logInUser(credentials.userNameLogIn, credentials.passwordLogIn);
          
          if(userLoggingIn?.error) {
            // When returning null, next-auth will return an error
            return null;
          }
        }

        // If the user is successfully logged in, we create the session with the user data (userId and userName)
        console.log(userLoggingIn)
        const user = { id: userLoggingIn?.userIdLogged, name: userLoggingIn?.userNameLogged }
        return user;
      },
    }),
  ],
  callbacks: {
    // Here we add the id field to the JWT token
    async jwt({ token, user }:{ token:JWT, user:any }) {
      if (user?.id) {
        token.id = user.id
      }
      return token
    },
    // And here we add the id field from the token to the session, so we can access it in the client side with useSession
    async session({ session, token }:{ session:any, token:JWT }) {
      if (session.user) {
        session.user.id = token.id
      }

      return session
    },
    async signIn({ user, account }:any) {
      if (account?.provider === "google") {
        let userResult = await logInUserGoogle(user.id, user.email)
        if(userResult){
          user.id = userResult.userId
          user.name = userResult.userName
        }
      }
      return true
    },

  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
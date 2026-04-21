"use client";
import React from "react";
import { signIn, useSession } from "next-auth/react";

export default function GoogleSignInButton() {
    
    const { data: session } = useSession()

    function handleGoogleSignIn() {
        signIn('google', { callbackUrl: '/' });
    }

    if (!session) {
        return (
            <button
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-3 px-4 py-2 border rounded-lg text-black bg-white mt-4 hover:bg-gray-200">
                <img src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google icon"
                    className="w-5 h-5 rounded rounded-full"
                />
                <span>Continue with Google</span>
            </button>
        );
    }
}
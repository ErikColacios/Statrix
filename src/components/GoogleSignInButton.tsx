"use client";
import React from "react";
import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
    
    function handleGoogleSignIn() {
        signIn('google', { callbackUrl: '/newUser' });
    }

    return (
        <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-3 px-4 py-2 border rounded-lg text-black bg-white mt-4 hover:bg-gray-200">
            <img src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google icon"
                className="w-5 h-5 rounded-sm rounded-full"
            />
            <span>Continue with Google</span>
        </button>
    );
}
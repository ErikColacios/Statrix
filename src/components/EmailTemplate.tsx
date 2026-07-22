import React from 'react';

interface EmailTemplateProps {
    userName: string;
    token: string;
}

export function EmailTemplate({ userName, token }: EmailTemplateProps) {
    return (
        <div style={{ backgroundColor: "black", color: "#9E9E9E", width: "100%", padding: "2%", fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'}}>
            <div style={{maxWidth: "400px", margin: "0 auto"}}>
                <img src="https://statrix.app/logos/st2_white.png" alt="Statrix logo" width="200" />
                <p style={{ color: "white", marginTop: "16px" }}>Hi {userName}, welcome to Statrix!</p>
                <p>To finish your account setup, click the button below. </p>
                <a
                    href={`http://localhost:3000/verifyEmail?token=${token}`}
                    //href={`https://statrix.app?token=${token}`}
                    style={{
                        display: "inline-block",
                        backgroundColor: "#2A2828",
                        color: "#ffffff",
                        padding: "12px 32px",
                        borderRadius: "8px",
                        border: "1px solid #00932C",
                        textDecoration: "none",
                        fontWeight: "bold"
                    }}
                >
                    Verify account
                </a>
                <p>If you didn’t request this email just ignore it.</p>
                <p style={{ marginTop: "12px" }}>Thank you for joining!</p>
                <p style={{ textDecoration: "none" }}>statrix.app</p>
            </div>
        </div>
    );
}
import React from "react"
import Link from "next/link"

type Props = {
    children: React.ReactNode,
    href?: string,
    onClick?: () => void,
    className?: string
}

// Back arrow link. With href it navigates, with onClick it renders a button (e.g. to go back to a previous view)
export default function BackLink({ children, href, onClick, className = "" }: Props) {
    const classes = `group inline-flex items-center text-sm text-gray-400 hover:text-green-400 transition ${className}`
    const content = (
        <>
            <svg className="w-5 fill-current transition group-hover:-translate-x-0.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" /></svg>
            {children}
        </>
    )

    if (href) {
        return <Link href={href} className={classes}>{content}</Link>
    }

    return <button type="button" onClick={onClick} className={classes}>{content}</button>
}
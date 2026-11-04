import React from "react";

// Links and icons shared by the desktop navbar, the profile dropdown and the mobile menu

const iconProps = {
    xmlns: "http://www.w3.org/2000/svg", width: 18, height: 18, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
}

export const icons = {
    games: <svg {...iconProps}><path d="M6 11h4M8 9v4M15 12h.01M18 10h.01" /><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59l-.9 8.06A2 2 0 0 0 3.8 19c.75 0 1.43-.42 1.77-1.09L7 15h10l1.43 2.91A2 2 0 0 0 20.2 19a2 2 0 0 0 1.99-2.35l-.9-8.06A4 4 0 0 0 17.32 5z" /></svg>,
    community: <svg {...iconProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    friends: <svg {...iconProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>,
    myGames: <svg {...iconProps}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>,
    myLists: <svg {...iconProps}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>,
    settings: <svg {...iconProps}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>,
    logOut: <svg {...iconProps}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>,
}

// Main sections. The ones with requiresSession are only shown to logged users
export const mainLinks = [
    { href: "/browseGames", label: "Games", icon: icons.games, requiresSession: false },
    { href: "/community", label: "Community", icon: icons.community, requiresSession: true },
    { href: "/friends", label: "Friends", icon: icons.friends, requiresSession: true },
]

// Personal pages of the logged user
export const userLinks = [
    { href: "/mygames", label: "My games", icon: icons.myGames },
    { href: "/mylists", label: "My lists", icon: icons.myLists },
    { href: "/settings", label: "Settings", icon: icons.settings },
]

export function isActiveLink(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
}

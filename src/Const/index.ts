import { Route } from "next";

interface NavItem {
    title: string;
    href: Route;
}
export const NAV_ITEMS = [
    {
        title: "Home",
        href: "/",
        
    },
    {
        title: "Menu",
        href: "/menu",
    },
    {
        title: "Offers",
        href: "/offers",
    },
    {
        title: "Contact",
        href: "/contact",
    },
];

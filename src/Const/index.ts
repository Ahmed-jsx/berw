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
    title: "About Us",
    href: "/about-us",
  },
  {
    title: "Menu",
    href: "/menu",
  },
  {
    title: "Merch",
    href: "/merch",
  },

  {
    title: "Contact",
    href: "/contact",
  },
];

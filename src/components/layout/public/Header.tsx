import React from "react";
import Link from "next/link";

export const Header = () => {
  const routes = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "About",
      url: "/about",
    },
  ];

  return (
    <header>
      <nav>
        {routes.map((route) => (
          <Link key={route.url} href={route.url}>
            {route.name}
          </Link>
        ))}
      </nav>
    </header>
  );
};
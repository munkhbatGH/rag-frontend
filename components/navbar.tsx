"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { LogIn } from 'lucide-react';

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
  Logo,
} from "@/components/icons";
import { Avatar } from "@heroui/avatar";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const { username, setUsername } = useUserStore();

  useEffect(() => {
    const token_name = process.env.NEXT_PUBLIC_TOKEN || "eas-token";
    const cookieToken = Cookies.get(token_name) || null;

    if (!cookieToken && pathname.includes('admin')) {
      router.push("/");
    }
    setToken(cookieToken)
    if (cookieToken) getUserInfo(cookieToken)
  }, [pathname]);


  const getUserInfo = async (cookieToken: any) => {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookieToken}`
        },
        method: 'GET'
      }
      const res = await fetch('http://localhost:8000/get-user-info', options);
      if (res?.ok) {
        const response = await res.json();
        setUsername(response.username);
      } else {
        // const error = await res.json();
      }
    } catch (error: any) {
    }
  };

  const logout = () => {
    const token_name = process.env.NEXT_PUBLIC_TOKEN || 'rag-token';
    Cookies.remove(token_name);
    router.push("/login");
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">RAG</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
        {
          token && (
            <NavbarItem className="hidden md:flex">
              <Button
                as={Link}
                className="text-sm font-normal text-default-600 bg-default-100"
                href={"/admin"}
                variant="flat"
              >
                RAG хуудас
              </Button>
            </NavbarItem>
          )
        }
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {
          !token && (
            <NavbarItem className="hidden md:flex">
              <Button
                as={Link}
                className="text-sm font-normal text-default-600 bg-default-100"
                href={"/login"}
                variant="flat"
              >
                Нэвтрэх
              </Button>
            </NavbarItem>
          )
        }
        {
          token && (
            <>
              <NavbarItem className="hidden flex items-center gap-3">
                <Button
                  className="text-sm font-normal text-default-600 bg-default-100"
                  variant="flat"
                >
                  { username }
                </Button>
                <Avatar size="sm" isBordered color="success" src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
              </NavbarItem>
              <NavbarItem className="hidden md:flex">
                <Button
                  as={Link}
                  className="text-sm font-normal text-default-600 bg-default-100"
                  href={"/login"}
                  startContent={<LogIn className="text-danger" />}
                  variant="flat"
                  onPress={logout}
                >
                </Button>
              </NavbarItem>
            </>
          )
        }
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

    </HeroUINavbar>
  );
};

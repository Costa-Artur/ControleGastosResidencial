"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Item, ItemContent } from "./ui/item";
import { cn } from "@/lib/utils";
import { 
NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
 } from "./ui/navigation-menu";

const menuItems = [
    { name: "Pessoas", href: "/" },
    { name: "Categorias", href: "/categories" },
    { name: "Transações", href: "/transactions" },
];

export default function MenuBar() {
    const pathname = usePathname();

    const isItemActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return(
        <div className="flex w-full">
            <Item variant="outline">
                <ItemContent>
                    <NavigationMenu>
                        <NavigationMenuList>
                            {menuItems.map((item) => {
                                const active = isItemActive(item.href);

                                return (
                                    <NavigationMenuItem key={item.href}>
                                        {active ? (
                                            <NavigationMenuLink
                                                aria-disabled="true"
                                                data-active
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    "pointer-events-none opacity-60"
                                                )}
                                            >
                                                {item.name}
                                            </NavigationMenuLink>
                                        ) : (
                                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                                <Link href={item.href}>{item.name}</Link>
                                            </NavigationMenuLink>
                                        )}
                                    </NavigationMenuItem>
                                );
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>
                </ItemContent>
            </Item>
        </div>
    )
}
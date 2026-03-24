import Link from "next/link"
import { Item, ItemContent } from "./ui/item";
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
];

export default function MenuBar() {
    return(
        <div className="flex w-full">
            <Item variant="outline">
                <ItemContent>
                    <NavigationMenu>
                        <NavigationMenuList>
                            {menuItems.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                        <Link href={item.href}>{item.name}</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </ItemContent>
            </Item>
        </div>
    )
}
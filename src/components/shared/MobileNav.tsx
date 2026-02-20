"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Wine,
  BookOpen,
  Home,
  GlassWater,
  Sparkles,
  BookMarked,
  LogIn,
  Beer,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/cocktails", label: t("cocktails"), icon: GlassWater },
    { href: "/suggestion", label: t("suggestion"), icon: Sparkles },
    { href: "/my-bar", label: t("myBar"), icon: Beer },
  ];

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="bg-background border-l border-primary/20 w-[300px] sm:w-[400px]"
        >
          <div className="flex flex-col h-full py-20">
            <nav className="flex flex-col space-y-4">
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center space-x-4 px-6 py-4 rounded-xl transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary font-bold shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <link.icon className="h-6 w-6" />
                    <span className="text-lg">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

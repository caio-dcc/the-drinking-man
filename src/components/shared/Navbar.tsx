"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GooeyNav from "@/components/ui/GooeyNav";
import { MobileNav } from "@/components/shared/MobileNav";
import { FlagBR, FlagUS, FlagES } from "@/components/ui/Flags";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Navbar() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const handleLanguageChange = (value: string) => {
    // @ts-ignore -- locale type mismatch in validator
    router.replace(pathname, { locale: value as "en" | "pt" | "es" });
  };

  return (
    <nav className="w-full sticky top-0 z-50 border-none">
      {/* Dark overlay to match the sections tone */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="container mx-auto px-4 h-[120px] flex items-center relative z-10">
        {/* Logo Section - Absolute Left */}
        <Link
          href="/"
          className="absolute left-4 relative w-[100px] h-[100px] shrink-0"
        >
          <Image
            src="/drinkingman-nobg2.png"
            alt="The Drinking Man Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav - Centered */}
        <div className="hidden md:flex flex-1 items-center justify-center space-x-10">
          <Link
            href="/"
            className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors"
          >
            {t("home")}
          </Link>
          <Link
            href="/cocktails"
            className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors"
          >
            {t("cocktails")}
          </Link>
          <Link
            href="/suggestion"
            className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors"
          >
            {t("suggestion")}
          </Link>

          <Link
            href="/my-bar"
            className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors"
          >
            {t("myBar")}
          </Link>
        </div>

        {/* Language Switcher - Absolute Right */}
        <div className="hidden md:flex absolute right-4 items-center gap-2">
          <Select onValueChange={handleLanguageChange} defaultValue={locale}>
            <SelectTrigger className="w-[100px] h-10 bg-transparent border-none focus:ring-0 px-3 text-white hover:text-white/90 shadow-none text-base">
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent className="bg-secondary text-primary-foreground">
              <SelectItem
                value="pt"
                className="focus:bg-primary/20 focus:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <FlagBR className="w-4 h-3" />
                  <span>PT</span>
                </div>
              </SelectItem>
              <SelectItem
                value="en"
                className="focus:bg-primary/20 focus:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <FlagUS className="w-4 h-3" />
                  <span>EN</span>
                </div>
              </SelectItem>
              <SelectItem
                value="es"
                className="focus:bg-primary/20 focus:text-primary-foreground"
              >
                <div className="flex items-center gap-2">
                  <FlagES className="w-4 h-3" />
                  <span>ES</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Nav - Visible only on mobile */}
        <div className="md:hidden flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select onValueChange={handleLanguageChange} defaultValue={locale}>
              <SelectTrigger className="w-[100px] h-10 bg-transparent border-none focus:ring-0 px-3 text-white hover:text-white/90 shadow-none text-base">
                <SelectValue placeholder="Lang" />
              </SelectTrigger>
              <SelectContent className="bg-secondary text-primary-foreground">
                <SelectItem value="pt">
                  <div className="flex items-center gap-2">
                    <FlagBR className="w-4 h-3" />
                    <span>PT</span>
                  </div>
                </SelectItem>
                <SelectItem value="en">
                  <div className="flex items-center gap-2">
                    <FlagUS className="w-4 h-3" />
                    <span>EN</span>
                  </div>
                </SelectItem>
                <SelectItem value="es">
                  <div className="flex items-center gap-2">
                    <FlagES className="w-4 h-3" />
                    <span>ES</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}

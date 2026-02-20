"use client";

import React from "react";
import GlassIcons, { GlassIconsItem } from "@/components/ui/GlassIcons";
import { BookOpen, Martini, LogOut, User, Library, Wine } from "lucide-react";
import { useRouter } from "@/i18n/routing";

import { useUIStore } from "@/store/ui-store";

export function HeroMenu() {
  const router = useRouter();
  const { toggleSidebar, isLoggedIn, login, logout } = useUIStore();

  const handleMyBarClick = () => {
    if (isLoggedIn) {
      toggleSidebar();
    } else {
      // For demo purposes, we'll just log in on click if not logged in, or show an alert?
      // User said: "clicar em meu bar so é permitido quando logado"
      // Let's redirect to login if not logged in
      alert("Você precisa estar logado para acessar o Meu Bar.");
      router.push("/login"); // Or just call login() for demo? Let's stick to router for now or maybe just alert.
    }
  };

  const items: GlassIconsItem[] = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      color: "orange",
      label: "Artigos",
      onClick: () => console.log("Artigos"),
    },
    {
      icon: <Martini className="w-6 h-6" />,
      color: "red",
      label: "Meu Bar",
      onClick: handleMyBarClick,
    },
    {
      icon: isLoggedIn ? (
        <LogOut className="w-6 h-6" />
      ) : (
        <User className="w-6 h-6" />
      ),
      color: "blue",
      label: isLoggedIn ? "Sair" : "Login",
      onClick: isLoggedIn ? logout : () => router.push("/login"), // In real app, push to /login. For demo, maybe we want a way to toggle auth easily?
    },
    {
      icon: <Library className="w-6 h-6" />,
      color: "purple",
      label: "Leituras",
      onClick: () => console.log("Leituras"),
    },
    {
      icon: <Wine className="w-6 h-6" />,
      color: "green",
      label: "Coquetéis",
      onClick: () => router.push("/cocktails"),
    },
  ];

  return <GlassIcons items={items} />;
}

"use client";

import React from "react";
import { X, User, Settings, LogOut } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  const { isSidebarOpen, closeSidebar, user, logout } = useUIStore();

  // Fallback if no user (shouldn't happen if we only allow opening when logged in, but safe to have)
  const displayUser = user || {
    name: "Visitante",
    image: null,
    role: "Convidado",
  };

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-80 bg-[#3E2419] text-[#F0F4EF] shadow-2xl transition-transform duration-300 ease-in-out transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "'Quintessential', cursive" }}
            >
              Meu Bar
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              className="text-[#F0F4EF] hover:bg-[#5C3A2E]"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4 mb-8 p-4 bg-[#5C3A2E]/50 rounded-xl border border-[#A82323]/30">
            <Avatar className="h-12 w-12 border-2 border-[#A82323]">
              <AvatarImage
                src={displayUser.avatar || ""}
                alt={displayUser.name}
              />
              <AvatarFallback className="bg-[#1A0F0A] text-[#F0F4EF]">
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-lg">{displayUser.name}</p>
              <p className="text-sm text-[#C0C4BF]">{displayUser.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-lg hover:bg-[#5C3A2E] hover:text-[#F0F4EF]"
            >
              <Settings className="mr-3 h-5 w-5" />
              Configurações
            </Button>
            {/* Add more items here */}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-[#A82323]/30">
            <Button
              variant="ghost"
              className="w-full justify-start text-lg text-red-400 hover:bg-[#5C3A2E] hover:text-red-300"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

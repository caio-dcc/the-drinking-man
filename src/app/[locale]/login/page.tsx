"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement login logic
    console.log("Login attempt:", { email, password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/background-wood.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-primary/20 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-white font-secondary tracking-wide">
              {t("title")}
            </h1>
            <p className="text-white/60 text-sm mt-2">{t("subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80 mb-1.5"
              >
                {t("email")}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="!bg-white/10 !border-white/20 focus:!border-primary !text-white placeholder:!text-white/40 h-11"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80 mb-1.5"
              >
                {t("password")}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                required
                className="!bg-white/10 !border-white/20 focus:!border-primary !text-white placeholder:!text-white/40 h-11"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base tracking-wide"
            >
              {t("submit")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

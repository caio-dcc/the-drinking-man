"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Cocktail } from "@/types";
import { DrinkCard } from "@/components/feature/DrinkCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  Beer,
  Utensils,
  Search,
  ChevronRight,
  ChevronLeft,
  X,
  PlusCircle,
  LogIn,
  LogOut,
  Users,
  Settings,
  Wine,
} from "lucide-react";
import localCocktailsData from "@/data/cocktails.json";

type InventoryItem = {
  id: string;
  barId: string;
  customName: string | null;
  category: string | null; // "ingredient" | "food" | "drink"
  ingredientId: string | null;
};

type Bar = {
  id: string;
  name: string;
  creatorId: string;
  inventory: InventoryItem[];
  sharedWith: { id: string; username: string }[];
};

type User = {
  id: string;
  username: string;
};

export default function MyBarPage() {
  const t = useTranslations("Navigation");
  const localCocktails = localCocktailsData as unknown as Cocktail[];

  // User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Bar State
  const [bars, setBars] = useState<Bar[]>([]);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const [newBarName, setNewBarName] = useState("");

  // Inventory Management State
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<
    "ingredient" | "food" | "drink"
  >("ingredient");

  // Sharing State
  const [shareUsername, setShareUsername] = useState("");
  const [shareSuccess, setShareSuccess] = useState("");

  // Results State
  const [matchedCocktails, setMatchedCocktails] = useState<Cocktail[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Load User from Session storage (optional, simple for now)
  useEffect(() => {
    const savedUser = sessionStorage.getItem("drinkingman_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch Bars when User changes
  useEffect(() => {
    if (currentUser) {
      fetchBars();
    } else {
      setBars([]);
      setSelectedBar(null);
    }
  }, [currentUser]);

  const fetchBars = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/bar?userId=${currentUser.id}`);
      const data = await res.json();
      setBars(data);
      if (data.length > 0 && !selectedBar) {
        setSelectedBar(data[0]);
      } else if (selectedBar) {
        const updated = data.find((b: Bar) => b.id === selectedBar.id);
        if (updated) setSelectedBar(updated);
      }
    } catch (e) {
      console.error("Error fetching bars:", e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setAuthError(data.error);
      } else {
        setCurrentUser(data);
        sessionStorage.setItem("drinkingman_user", JSON.stringify(data));
      }
    } catch (e) {
      setAuthError("Erro na conexão");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("drinkingman_user");
    setShowResults(false);
  };

  const handleCreateBar = async () => {
    if (!newBarName.trim() || !currentUser) return;
    try {
      const res = await fetch("/api/bar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBarName, creatorId: currentUser.id }),
      });
      await fetchBars();
      setNewBarName("");
    } catch (e) {
      console.error("Error creating bar:", e);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !selectedBar) return;
    try {
      await fetch(`/api/bar/${selectedBar.id}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItemName.trim(),
          category: newItemCategory,
        }),
      });
      await fetchBars();
      setNewItemName("");
    } catch (e) {
      console.error("Error adding item:", e);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!selectedBar) return;
    try {
      await fetch(`/api/bar/${selectedBar.id}/inventory?itemId=${itemId}`, {
        method: "DELETE",
      });
      await fetchBars();
    } catch (e) {
      console.error("Error removing item:", e);
    }
  };

  const handleShare = async () => {
    if (!shareUsername.trim() || !selectedBar) return;
    try {
      const res = await fetch(`/api/bar/${selectedBar.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: shareUsername }),
      });
      const data = await res.json();
      if (data.error) {
        setShareSuccess(`Erro: ${data.error}`);
      } else {
        setShareSuccess("Compartilhado com sucesso!");
        setShareUsername("");
        fetchBars();
        setTimeout(() => setShareSuccess(""), 3000);
      }
    } catch (e) {
      setShareSuccess("Erro ao compartilhar");
    }
  };

  // Matching Logic
  const allKnownIngredients = useMemo(() => {
    const set = new Set<string>();
    localCocktails.forEach((c) => {
      for (let i = 1; i <= 15; i++) {
        const ing = c[`strIngredient${i}` as keyof Cocktail] as string;
        if (ing) set.add(ing.trim());
      }
    });
    return Array.from(set).sort();
  }, [localCocktails]);

  const findPossibleDrinks = () => {
    if (!selectedBar) return;
    const myIngredients = new Set(
      selectedBar.inventory
        .filter((i) => i.category === "ingredient" || i.category === "drink")
        .map((i) => (i.customName || "").toLowerCase()),
    );

    const matches = localCocktails.filter((cocktail) => {
      const required = [];
      for (let i = 1; i <= 15; i++) {
        const ing = cocktail[`strIngredient${i}` as keyof Cocktail] as string;
        if (ing) required.push(ing.toLowerCase());
      }
      return required.every((req) => myIngredients.has(req));
    });

    setMatchedCocktails(matches);
    setShowResults(true);
  };

  // Render Login state if not logged in
  if (!currentUser) {
    return (
      <div
        className="min-h-screen py-16 px-4 flex items-center justify-center relative"
        style={{
          backgroundImage: "url('/background-wood.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/70 z-0" />
        <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-primary/20 rounded-full">
              <Wine size={48} className="text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Acesso Restrito
          </h1>
          <p className="text-white/40 text-center mb-8 text-sm">
            Digite suas credenciais configuradas manualmente no sistema.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white/60 text-xs uppercase font-bold tracking-wider">
                Usuário
              </label>
              <Input
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Ex: caio"
                className="bg-white/5 border-white/10 text-white h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/60 text-xs uppercase font-bold tracking-wider">
                Senha
              </label>
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white h-12"
                required
              />
            </div>
            {authError && (
              <p className="text-red-400 text-sm text-center font-medium bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                {authError}
              </p>
            )}
            <Button type="submit" className="w-full h-14 text-lg font-bold">
              Entrar no Bar
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-16 px-4 relative"
      style={{
        backgroundImage: "url('/background-wood.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="container mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Beer className="text-primary h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Olá, {currentUser.username}
              </h1>
              <p className="text-white/40">Gerencie seus bares e inventários</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedBar?.id || ""}
                onChange={(e) =>
                  setSelectedBar(
                    bars.find((b) => b.id === e.target.value) || null,
                  )
                }
                className="bg-white/5 border border-white/10 text-white px-4 h-12 rounded-xl appearance-none pr-10 focus:ring-primary focus:border-primary outline-none min-w-[200px]"
              >
                <option value="" disabled className="bg-zinc-900">
                  Selecionar um Bar
                </option>
                {bars.map((bar) => (
                  <option key={bar.id} value={bar.id} className="bg-zinc-900">
                    {bar.name}{" "}
                    {bar.creatorId !== currentUser.id ? "(Compartilhado)" : ""}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 h-4 w-4 text-white/40 pointer-events-none" />
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-white/40 hover:text-red-400 h-12 px-4 gap-2"
            >
              <LogOut size={18} /> Sair
            </Button>
          </div>
        </div>

        {/* Main Interface */}
        {!selectedBar ? (
          <div className="max-w-2xl mx-auto py-20 text-center">
            <PlusCircle size={80} className="mx-auto text-white/10 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-8">
              Crie seu primeiro bar
            </h2>
            <div className="flex gap-2">
              <Input
                placeholder="Nome do seu bar (Ex: Bar da Varanda)"
                value={newBarName}
                onChange={(e) => setNewBarName(e.target.value)}
                className="bg-white/5 border-white/20 text-white h-14"
              />
              <Button onClick={handleCreateBar} className="h-14 px-8 font-bold">
                Criar
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Tools */}
            <div className="lg:col-span-3 space-y-8">
              {/* Add Item Form */}
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <PlusCircle className="text-primary h-5 w-5" /> Adicionar Item
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Nome do ingrediente..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      list="ingredient-suggestions"
                      onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                    />
                    <datalist id="ingredient-suggestions">
                      {allKnownIngredients.map((ing) => (
                        <option key={ing} value={ing} />
                      ))}
                    </datalist>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["ingredient", "drink", "food"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewItemCategory(cat as any)}
                        className={`flex-1 py-3 px-1 rounded-lg border text-[10px] font-bold transition-all flex flex-col items-center gap-2 capitalize ${
                          newItemCategory === cat
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-white/5 border-white/10 text-white/40"
                        }`}
                      >
                        {cat === "ingredient" ? (
                          <Beer size={16} />
                        ) : cat === "drink" ? (
                          <Search size={16} />
                        ) : (
                          <Utensils size={16} />
                        )}
                        {cat === "ingredient"
                          ? "Ingr."
                          : cat === "drink"
                            ? "Bebida"
                            : "Comida"}
                      </button>
                    ))}
                  </div>
                  <Button onClick={handleAddItem} className="w-full font-bold">
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Sharing Form - Only if Creator */}
              {selectedBar.creatorId === currentUser.id && (
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="text-blue-400 h-5 w-5" /> Compartilhamento
                  </h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="Username do usuário..."
                      value={shareUsername}
                      onChange={(e) => setShareUsername(e.target.value)}
                      className="bg-white/5 border-white/10 text-white h-11"
                    />
                    <Button
                      onClick={handleShare}
                      variant="secondary"
                      className="w-full font-bold"
                    >
                      Compartilhar Bar
                    </Button>

                    {shareSuccess && (
                      <p className="text-xs text-center py-2 bg-white/5 rounded-lg text-white/60 border border-white/10">
                        {shareSuccess}
                      </p>
                    )}

                    {selectedBar.sharedWith.length > 0 && (
                      <div className="pt-4 mt-4 border-t border-white/10">
                        <p className="text-xs font-bold text-white/40 uppercase mb-3">
                          Compartilhado com:
                        </p>
                        <ul className="space-y-2">
                          {selectedBar.sharedWith.map((u) => (
                            <li
                              key={u.id}
                              className="flex justify-between items-center text-sm text-white/80 bg-white/5 px-3 py-2 rounded-lg"
                            >
                              <span>@{u.username}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bar Management */}
              {selectedBar.creatorId === currentUser.id && (
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex justify-between items-center">
                  <span className="text-white/40 text-xs font-bold">
                    Ações Administrativas
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-400/20 px-2 h-8"
                  >
                    Excluir Bar
                  </Button>
                </div>
              )}

              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
                <div className="flex gap-3 mb-4">
                  <Plus className="text-primary" />
                  <h3 className="font-bold text-white">Adicionar Novo Bar</h3>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newBarName}
                    onChange={(e) => setNewBarName(e.target.value)}
                    placeholder="Nome..."
                    className="bg-white/5 border-primary/20 text-white h-10"
                  />
                  <Button
                    onClick={handleCreateBar}
                    size="sm"
                    className="font-bold"
                  >
                    OK
                  </Button>
                </div>
              </div>
            </div>

            {/* Inventory List */}
            <div className="lg:col-span-9 space-y-8">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl min-h-[500px]">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {selectedBar.name}
                    </h2>
                    <p className="text-white/40 italic">
                      {selectedBar.creatorId === currentUser.id
                        ? "Seu bar principal"
                        : "Bar compartilhado com você"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-6xl font-black text-white/5 absolute right-8 top-8 select-none">
                      {selectedBar.inventory.length}
                    </span>
                    <Button
                      onClick={findPossibleDrinks}
                      size="lg"
                      className="px-8 h-14 text-lg font-black gap-3 shadow-xl rounded-2xl hover:scale-105 transition-transform"
                    >
                      <Utensils size={20} /> Ver Drinks disponíveis
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedBar.inventory.length === 0 ? (
                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center opacity-20">
                      <Search size={80} className="mb-4" />
                      <p className="text-2xl font-bold">Inventário Vazio</p>
                      <p>Adicione itens usando o painel lateral.</p>
                    </div>
                  ) : (
                    selectedBar.inventory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl ${
                              item.category === "ingredient"
                                ? "bg-primary/20 text-primary shadow-primary/10"
                                : item.category === "drink"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-green-500/20 text-green-400"
                            } shadow-inner`}
                          >
                            {item.category === "ingredient" ? (
                              <Beer size={20} />
                            ) : item.category === "drink" ? (
                              <Wine size={20} />
                            ) : (
                              <Utensils size={20} />
                            )}
                          </div>
                          <span className="text-white font-bold text-lg capitalize">
                            {item.customName}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Matching Results Section */}
              {showResults && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                      Menu de hoje
                      <span className="bg-primary text-black text-xs px-3 py-1 rounded-full font-black">
                        {matchedCocktails.length} OPÇÕES
                      </span>
                    </h2>
                    <Button
                      variant="ghost"
                      onClick={() => setShowResults(false)}
                      className="text-white/40 hover:text-white"
                    >
                      <X className="mr-2 h-4 w-4" /> Esconder
                    </Button>
                  </div>

                  {matchedCocktails.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                      {matchedCocktails.map((cocktail) => (
                        <DrinkCard key={cocktail.idDrink} cocktail={cocktail} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-black/30 backdrop-blur-md rounded-3xl p-20 text-center border border-dashed border-white/10">
                      <Search size={80} className="mx-auto text-white/5 mb-6" />
                      <p className="text-white/60 text-2xl font-black uppercase tracking-widest">
                        Nenhum Match
                      </p>
                      <p className="text-white/40 mt-4 max-w-md mx-auto">
                        Infelizmente seu inventário atual não cobre as receitas
                        do nosso catálogo. Tente adicionar alguns insumos
                        básicos como Xarope de Açúcar, Limão ou Tonica.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

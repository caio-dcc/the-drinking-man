import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type MoodOption = {
  id: string;
  label: string;
  emoji: string;
  color: string; // Tailwind class for bg/text
};

interface VisualMoodSelectorProps {
  options: MoodOption[];
  selectedMood: string;
  onSelect: (moodId: string) => void;
}

export function VisualMoodSelector({
  options,
  selectedMood,
  onSelect,
}: VisualMoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {options.map((option) => {
        const isSelected = selectedMood === option.id;
        return (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(option.id)}
            className={cn(
              "relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 cursor-pointer h-32",
              isSelected
                ? `bg-transparent shadow-none`
                : "bg-transparent hover:bg-white/5",
            )}
          >
            <span className="text-4xl mb-2 filter drop-shadow-sm">
              {option.emoji}
            </span>
            <span
              className={cn(
                "text-sm font-bold tracking-wide",
                isSelected ? "text-primary" : "text-white",
              )}
            >
              {option.label}
            </span>
            {isSelected && (
              <motion.div
                layoutId="mood-indicator"
                className="absolute inset-0 rounded-xl bg-white/5 pointer-events-none"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

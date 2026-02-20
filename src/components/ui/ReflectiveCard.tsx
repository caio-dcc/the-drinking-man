"use client";

import React from "react";
import Image from "next/image";

interface ReflectiveCardProps {
  blurStrength?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  overlayColor?: string;
  displacementStrength?: number;
  noiseScale?: number;
  specularConstant?: number;
  grayscale?: number;
  glassDistortion?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ReflectiveCard: React.FC<ReflectiveCardProps> = ({
  blurStrength = 12,
  color = "white",
  metalness = 1,
  roughness = 0.4,
  overlayColor = "rgba(255, 255, 255, 0.1)",
  displacementStrength = 20,
  noiseScale = 1,
  specularConstant = 1.2,
  grayscale = 1,
  glassDistortion = 0,
  className = "",
  style = {},
}) => {
  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    "--blur-strength": `${blurStrength}px`,
    "--metalness": metalness,
    "--roughness": roughness,
    "--overlay-color": overlayColor,
    "--text-color": color,
    "--saturation": saturation,
  } as React.CSSProperties;

  return (
    <div
      className={`relative w-[320px] h-[500px] rounded-[20px] overflow-hidden bg-[#1a1a1a] shadow-[0_20px_50px_rgba(0,0,0,0.5)] isolate font-sans ${className}`}
      style={style}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/minhacara.png"
          alt="Profile"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold tracking-[0.05em] m-0 mb-2 drop-shadow-md">
            CAIO MARQUES
          </h2>
          <p className="text-[10px] tracking-[0.15em] opacity-90 m-0 uppercase w-full mx-auto leading-relaxed font-medium">
            Mixologista, Desenvolvedor e Criador do Site
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReflectiveCard;

// src/features/passport/graphThemes.ts
import { Sparkles, Waves, Sun, Shield, type LucideIcon } from "lucide-react";

export interface GraphTheme {
  stroke: string;
  gradientFrom: string;
  gradientTo: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export const GRAPH_THEMES: Record<string, GraphTheme> = {
  collagen_synthesis: {
    stroke: "#B27A8E",
    gradientFrom: "#F4A5BC",
    gradientTo: "#B27A8E",
    icon: Sparkles,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
  },
  skin_tone: {
    stroke: "#8B5CB8",
    gradientFrom: "#C4A3E0",
    gradientTo: "#8B5CB8",
    icon: Waves,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
  },
  photoaging: {
    stroke: "#D99A3D",
    gradientFrom: "#F5C87A",
    gradientTo: "#D99A3D",
    icon: Sun,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  skin_protection: {
    stroke: "#4F9D74",
    gradientFrom: "#8FD5B0",
    gradientTo: "#4F9D74",
    icon: Shield,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
};

export const GRAPH_ORDER = [
  "collagen_synthesis",
  "skin_tone",
  "photoaging",
  "skin_protection",
] as const;
import {
  Sparkles,
  Dna,
  TrendingUp,
  Waves,
  Sun,
  Droplets,
  Palette,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

export interface WelcomeSlide {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  text: string;
  bg: string;
  halo: string;
  image: string; // 👈 новое
  position?: "center" | "top" | "bottom";
}

export const welcomeSlides: WelcomeSlide[] = [
  {
    icon: Sparkles,
    iconColor: "text-rose-500",
    title: "Паспорт вашей кожи",
    text: "Соберите всю информацию о состоянии кожи в одном месте",
    bg: "bg-welcome-rose",
    halo: "bg-rose-100 dark:bg-rose-500/20",
    image: "/backgrounds/welcome-1.jpg",
    position: "center",
  },
  {
    icon: Dna,
    iconColor: "text-purple-500",
    title: "Генетика + ИИ",
    text: "Узнайте предрасположенности и тип старения именно вашей кожи",
    bg: "bg-welcome-purple",
    halo: "bg-purple-100 dark:bg-purple-500/20",
    image: "/backgrounds/welcome-2.jpg",
    position: "center",
  },
  {
    icon: TrendingUp,
    iconColor: "text-amber-500",
    title: "Динамика и уход",
    text: "Отслеживайте прогресс и получайте персональные рекомендации",
    bg: "bg-welcome-amber",
    halo: "bg-amber-100 dark:bg-amber-500/20",
    image: "/backgrounds/welcome-3.jpg",
    position: "center",
  },
];

export interface GoalOption {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  label: string;
}

export const goalOptions: GoalOption[] = [
  {
    id: "acne",
    icon: ShieldAlert,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    label: "Акне и высыпания",
  },
  {
    id: "wrinkles",
    icon: Waves,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    label: "Морщины и лифтинг",
  },
  {
    id: "pigmentation",
    icon: Sun,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    label: "Пигментация",
  },
  {
    id: "dryness",
    icon: Droplets,
    iconColor: "text-sky-500",
    iconBg: "bg-sky-50",
    label: "Сухость и шелушение",
  },
  {
    id: "tone",
    icon: Palette,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    label: "Ровный тон",
  },
];

export const ONBOARDING_STEPS = [
  "welcome",
  "name",
  "goal",
  "subjective",
  "objective",
  "genotypes",
  "factors",
  "result",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

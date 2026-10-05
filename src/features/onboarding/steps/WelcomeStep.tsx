import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { welcomeSlides } from "../onboardingData";
import { PetalBurst } from "@/components/decor";
import { HeroBackdrop } from "@/components/decor/HeroBackdrop";
import { HeroCard } from "@/components/decor/HeroCard";

export function WelcomeStep() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const slide = welcomeSlides[index];
  const isLast = index === welcomeSlides.length - 1;
  const Icon = slide.icon;

  const next = () =>
    isLast ? navigate("/onboarding/name") : setIndex((i) => i + 1);

  return (
    <div
      className={`min-h-screen flex flex-col ${slide.bg} transition-colors duration-500 relative overflow-hidden`}
    >
      <HeroBackdrop
        image={slide.image}
        overlay="auto"
        intensity="medium"
        position={slide.position}
      >
        <PetalBurst />
      </HeroBackdrop>
      <div className="relative flex-1 flex items-center justify-center px-8 safe-top">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-center max-w-sm flex flex-col items-center"
          >
            {/* Кружок с иконкой — HeroCard для blur */}
            <HeroCard padding="md" className="rounded-full mb-8">
              <Icon size={48} strokeWidth={1.5} className={slide.iconColor} />
            </HeroCard>

            <h1 className="text-3xl font-display text-ink mb-3 drop-shadow-sm">
              {slide.title}
            </h1>
            <p className="text-base text-muted leading-relaxed">{slide.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative px-8 pb-10 safe-bottom">
        <div className="flex justify-center gap-2 mb-8">
          {welcomeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Слайд ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-primary" : "w-2 bg-primary/30"
              }`}
            />
          ))}
        </div>

        <Button fullWidth size="lg" onClick={next}>
          <span className="inline-flex items-center gap-2">
            {isLast ? "Начать" : "Далее"}
            <ArrowRight size={18} />
          </span>
        </Button>

        {isLast && (
          <p className="text-center text-sm text-muted mt-4">
            Уже есть аккаунт?{" "}
            <Link to="/auth/login" className="text-primary font-medium">
              Войти
            </Link>
          </p>
        )}

        {!isLast && (
          <button
            onClick={() => navigate("/onboarding/name")}
            className="w-full text-muted text-sm mt-3 py-2"
          >
            Пропустить
          </button>
        )}
      </div>
    </div>
  );
}

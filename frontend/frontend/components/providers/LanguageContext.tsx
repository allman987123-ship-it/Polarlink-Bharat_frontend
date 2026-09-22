"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, SupportedLanguage, Translations } from "@/lib/i18n";

export type TextScale = "normal" | "large" | "xlarge";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
  highContrast: boolean;
  setHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [textScale, setTextScale] = useState<TextScale>("normal");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("app_lang") as SupportedLanguage;
      if (savedLang && translations[savedLang]) {
        setLanguageState(savedLang);
      }
      const savedContrast = localStorage.getItem("app_contrast");
      if (savedContrast === "true") setHighContrast(true);
      const savedScale = localStorage.getItem("app_text_scale") as TextScale;
      if (savedScale) setTextScale(savedScale);
    } catch (e) {
      console.error("Language state restore error:", e);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("app_lang", lang);
    } catch (e) {}
  };

  const handleSetHighContrast = (val: boolean | ((prev: boolean) => boolean)) => {
    setHighContrast((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      try {
        localStorage.setItem("app_contrast", String(next));
      } catch (e) {}
      return next;
    });
  };

  const handleSetTextScale = (scale: TextScale) => {
    setTextScale(scale);
    try {
      localStorage.setItem("app_text_scale", scale);
    } catch (e) {}
  };

  const t = translations[language] || translations.en;

  const scaleClass =
    textScale === "large" ? "text-scale-large" : textScale === "xlarge" ? "text-scale-xlarge" : "";
  const contrastClass = highContrast ? "theme-high-contrast" : "";

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        highContrast,
        setHighContrast: handleSetHighContrast,
        textScale,
        setTextScale: handleSetTextScale,
      }}
    >
      <div className={`${scaleClass} ${contrastClass} min-h-screen flex flex-col`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

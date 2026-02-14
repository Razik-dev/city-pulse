"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { translations, type Language } from "@/lib/translations";

type TranslationContextType = {
    lang: Language;
    setLang: (lang: Language) => void;
    t: typeof translations.en;
};

const TranslationContext = createContext<TranslationContextType>({
    lang: "en",
    setLang: () => { },
    t: translations.en,
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>("en");
    const setLang = useCallback((l: Language) => {
        setLangState(l);
    }, []);

    const t = translations[lang];

    return (
        <TranslationContext.Provider value={{ lang, setLang, t }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    return useContext(TranslationContext);
}

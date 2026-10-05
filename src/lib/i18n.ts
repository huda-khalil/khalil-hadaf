import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import fa from "../locales/fa.json";

// Read saved language or default
const savedLang =
  typeof window !== "undefined"
    ? window.localStorage.getItem("khalil-hadaf-lang")
    : null;
const initialLang = savedLang === "fa" || savedLang === "en" ? savedLang : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  lng: initialLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Sync <html lang> and <html dir> when language changes
i18n.on("languageChanged", (lng) => {
  const html = document.documentElement;
  html.lang = lng;
  html.dir = lng === "fa" || lng === "ar" ? "rtl" : "ltr";
});

// Apply immediately on load
document.documentElement.lang = initialLang;
document.documentElement.dir = initialLang === "fa" ? "rtl" : "ltr";

export default i18n;

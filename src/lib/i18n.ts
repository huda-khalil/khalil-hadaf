import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import fa from "../locales/fa.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  lng: "en", // default language — change this one line later
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Sync <html lang> and <html dir> when language changes
i18n.on("languageChanged", (lng) => {
  const html = document.documentElement;
  html.lang = lng;
  html.dir = lng === "fa" || lng === "ar" ? "rtl" : "ltr";
});

export default i18n;

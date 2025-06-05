import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ua from "./locales/ua.json";

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: {
    en: { translation: en },
    ua: { translation: ua },
  },
  lng: "en",
  fallbackLng: "en",
});

export default i18next;

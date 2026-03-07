"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LOCALE, type Locale, type TranslationKey } from "./config";

type Messages = Record<string, string | Record<string, unknown>>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolve(messages: Messages, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = messages;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

function interpolate(
  template: string,
  params?: Record<string, string | number>
): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    params[key] != null ? String(params[key]) : `{{${key}}}`
  );
}

const messageCache = new Map<string, Messages>();

async function loadMessages(locale: Locale): Promise<Messages> {
  if (messageCache.has(locale)) return messageCache.get(locale)!;

  try {
    const mod = await import(`./locales/${locale}.json`);
    const messages = mod.default || mod;
    messageCache.set(locale, messages);
    return messages;
  } catch {
    // Fallback to English
    if (locale !== "en") return loadMessages("en");
    return {};
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    // Read saved locale from localStorage or user profile
    const saved = localStorage.getItem("greenledger-locale") as Locale | null;
    if (saved) setLocaleState(saved);
  }, []);

  useEffect(() => {
    loadMessages(locale).then(setMessages);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("greenledger-locale", newLocale);
    // Persist to user profile
    fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: newLocale }),
    }).catch(() => {});
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      const value = resolve(messages, key);
      if (value) return interpolate(value, params);
      // Return the last segment of the key as fallback
      return key.split(".").pop() || key;
    },
    [messages]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}

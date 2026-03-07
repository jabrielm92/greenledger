"use client";

import { useTranslation } from "@/lib/i18n";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function LanguageSwitcher({ className, compact }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();

  return (
    <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
      <SelectTrigger className={className ?? "w-[160px]"}>
        <Globe className="mr-2 h-4 w-4" />
        <SelectValue>
          {compact
            ? locale.toUpperCase()
            : SUPPORTED_LOCALES.find((l) => l.code === locale)?.name ?? locale}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LOCALES.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            <span className="mr-2">{l.flag}</span>
            {l.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

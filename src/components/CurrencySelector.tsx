"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const supportedCurrencies = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD (C$)" },
  { value: "JPY", label: "JPY (¥)" },
];

export function CurrencySelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCurrency = searchParams.get("currency")?.toUpperCase() || "USD";

  const handleCurrencyChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("currency", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={currentCurrency} onValueChange={handleCurrencyChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        {supportedCurrencies.map((currency) => (
          <SelectItem key={currency.value} value={currency.value}>
            {currency.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { CryptoAmountInput } from "@/components/CryptoAmountInput";
import { CryptoSelector } from "@/components/CryptoSelector";
import { CurrencySelector } from "@/components/CurrencySelector";
import { CalculateButton } from "@/components/CalculateButton"; // Renamed component

export function CalculatorControls() {
  const searchParams = useSearchParams();

  // Initialize state from URL search parameters
  const initialCryptoId = searchParams.get("crypto") || "bitcoin";
  const initialAmount = searchParams.get("amount") || "1";
  const initialCurrencyCode = searchParams.get("currency")?.toUpperCase() || "USD";

  const [cryptoId, setCryptoId] = React.useState(initialCryptoId);
  const [amount, setAmount] = React.useState(initialAmount);
  const [currencyCode, setCurrencyCode] = React.useState(initialCurrencyCode);

  // Update local state if URL search params change (e.g., from browser back/forward)
  React.useEffect(() => {
    setCryptoId(searchParams.get("crypto") || "bitcoin");
    setAmount(searchParams.get("amount") || "1");
    setCurrencyCode(searchParams.get("currency")?.toUpperCase() || "USD");
  }, [searchParams]);

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      <div className="flex flex-col gap-2">
        <Label htmlFor="crypto-amount" className="text-sm">Crypto Amount</Label>
        <div className="flex flex-col sm:flex-row gap-4">
          <CryptoAmountInput value={amount} onValueChange={setAmount} />
          <CryptoSelector value={cryptoId} onValueChange={setCryptoId} />
          <CurrencySelector value={currencyCode} onValueChange={setCurrencyCode} />
          <CalculateButton
            cryptoId={cryptoId}
            amount={amount}
            currencyCode={currencyCode}
          />
        </div>
      </div>
    </div>
  );
}
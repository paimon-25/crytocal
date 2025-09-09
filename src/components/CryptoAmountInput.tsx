"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CryptoAmountInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentAmount = searchParams.get("amount");

  // Use a controlled component for the input
  const [inputValue, setInputValue] = React.useState(currentAmount || "1");

  React.useEffect(() => {
    // Update internal state only when the URL's 'amount' parameter changes.
    // This ensures the input reflects the URL, but doesn't interfere with user typing
    // before the debounced URL update occurs.
    const newAmount = currentAmount || "1";
    if (inputValue !== newAmount) {
      setInputValue(newAmount);
    }
  }, [currentAmount]); // Only depend on currentAmount

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Update local state immediately

    // Debounce the URL update to avoid too many navigations
    const timeoutId = setTimeout(() => {
      const parsedValue = parseFloat(value);
      const params = new URLSearchParams(searchParams.toString());

      if (!isNaN(parsedValue) && parsedValue >= 0) {
        params.set("amount", parsedValue.toString());
      } else {
        params.delete("amount"); // Remove if invalid or empty, defaulting to 1 on the server
      }
      router.push(`?${params.toString()}`);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="crypto-amount" className="text-sm">Crypto Amount</Label>
      <Input
        id="crypto-amount"
        type="number"
        step="0.01"
        min="0"
        value={inputValue}
        onChange={handleAmountChange}
        className="w-[180px]"
        placeholder="e.g., 0.1"
      />
    </div>
  );
}
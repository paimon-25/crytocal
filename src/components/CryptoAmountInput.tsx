"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface CryptoAmountInputProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function CryptoAmountInput({ value, onValueChange }: CryptoAmountInputProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);
  };

  return (
    <Input
      id="crypto-amount"
      type="number"
      step="0.01"
      min="0"
      value={value}
      onChange={handleAmountChange}
      className="w-[180px]"
      placeholder="e.g., 0.1"
    />
  );
}
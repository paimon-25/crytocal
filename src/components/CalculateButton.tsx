"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { toast } from "sonner";

interface CalculateButtonProps {
  cryptoId: string;
  amount: string;
  currencyCode: string;
}

export function CalculateButton({ cryptoId, amount, currencyCode }: CalculateButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCalculate = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid crypto amount greater than zero.");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("crypto", cryptoId);
    params.set("currency", currencyCode);
    params.set("amount", parsedAmount.toString());
    params.set("calculated", "true"); // Add the calculated flag

    router.push(`?${params.toString()}`);
    toast.success(`Calculating purchasing power for ${parsedAmount} ${cryptoId} in ${currencyCode}.`);
  };

  return (
    <Button
      variant="secondary"
      onClick={handleCalculate}
      className="w-[180px] justify-center"
    >
      <Calculator className="mr-2 h-4 w-4" />
      Calculate
    </Button>
  );
}
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shuffle } from "lucide-react";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
}

interface Currency {
  code: string;
  name: string;
}

export function SurpriseMeButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cryptos, setCryptos] = React.useState<Crypto[]>([]);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch cryptos
        const cryptoResponse = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en",
          { next: { revalidate: 3600 } }
        );
        if (!cryptoResponse.ok) {
          const errorData = await cryptoResponse.json();
          console.error("Failed to fetch crypto list for Surprise Me:", cryptoResponse.statusText, errorData);
          toast.error("Failed to load crypto options for 'Surprise Me'.");
          return;
        }
        const cryptoData: any[] = await cryptoResponse.json();
        setCryptos(cryptoData.map((coin) => ({ id: coin.id, name: coin.name, symbol: coin.symbol })));

        // Fetch currencies
        const currencyResponse = await fetch("https://api.frankfurter.app/currencies", {
          next: { revalidate: 3600 * 24 },
        });
        if (!currencyResponse.ok) {
          const errorData = await currencyResponse.json();
          console.error("Failed to fetch currency list for Surprise Me:", currencyResponse.statusText, errorData);
          toast.error("Failed to load currency options for 'Surprise Me'.");
          return;
        }
        const currencyData: { [key: string]: string } = await currencyResponse.json();
        const formattedCurrencies = Object.entries(currencyData).map(([code, name]) => ({
          code,
          name,
        }));
        setCurrencies(formattedCurrencies);
      } catch (error) {
        console.error("Error fetching initial data for Surprise Me:", error);
        toast.error("An unexpected error occurred while preparing 'Surprise Me' options.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSurpriseMe = () => {
    if (cryptos.length === 0 || currencies.length === 0) {
      toast.warning("Still loading options for 'Surprise Me'. Please wait a moment.");
      return;
    }

    const randomCrypto = cryptos[Math.floor(Math.random() * cryptos.length)];
    const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
    
    // Generate a random amount, e.g., between 0.01 and 5, with some common values
    const amounts = [0.01, 0.1, 0.5, 1, 2, 5, 10, 20, 50, 100];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];

    const params = new URLSearchParams(searchParams.toString());
    params.set("crypto", randomCrypto.id);
    params.set("currency", randomCurrency.code);
    params.set("amount", randomAmount.toString());

    router.push(`?${params.toString()}`);
    toast.success(`Surprise! Showing ${randomAmount} ${randomCrypto.name} in ${randomCurrency.name}.`);
  };

  return (
    <Button
      variant="secondary"
      onClick={handleSurpriseMe}
      disabled={loading}
      className="w-[180px] justify-center"
    >
      <Shuffle className="mr-2 h-4 w-4" />
      Surprise Me!
    </Button>
  );
}
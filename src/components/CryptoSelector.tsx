"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
}

export function CryptoSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCryptoId = searchParams.get("crypto") || "bitcoin";

  const [open, setOpen] = React.useState(false);
  const [cryptos, setCryptos] = React.useState<Crypto[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCryptos = async () => {
      try {
        // Fetch top 100 coins by market cap for a good initial list
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en",
          { next: { revalidate: 3600 } } // Revalidate hourly
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch crypto list:", response.statusText, errorData);
          toast.error("Failed to fetch cryptocurrency list. Please try again later.");
          return;
        }
        const data: any[] = await response.json();
        setCryptos(data.map((coin) => ({ id: coin.id, name: coin.name, symbol: coin.symbol })));
      } catch (error) {
        console.error("Error fetching crypto list:", error);
        toast.error("An unexpected error occurred while fetching cryptocurrency list.");
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  const handleCryptoChange = (cryptoId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("crypto", cryptoId);
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const selectedCrypto = cryptos.find((crypto) => crypto.id === currentCryptoId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between"
          disabled={loading}
        >
          {selectedCrypto ? selectedCrypto.name : "Select crypto..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search crypto..." />
          <CommandList>
            <CommandEmpty>No crypto found.</CommandEmpty>
            <CommandGroup>
              {cryptos.map((crypto) => (
                <CommandItem
                  key={crypto.id}
                  value={crypto.name}
                  onSelect={() => handleCryptoChange(crypto.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentCryptoId === crypto.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
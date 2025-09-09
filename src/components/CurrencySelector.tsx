"use client";

import * as React from "react";
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

interface Currency {
  code: string;
  name: string;
}

interface CurrencySelectorProps {
  value: string;
  onValueChange: (currencyCode: string) => void;
}

export function CurrencySelector({ value, onValueChange }: CurrencySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("https://api.frankfurter.app/currencies", {
          next: { revalidate: 3600 * 24 },
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch currency list:", response.statusText, errorData);
          toast.error("Failed to fetch currency list. Please try again later.");
          return;
        }
        const data: { [key: string]: string } = await response.json();
        const formattedCurrencies = Object.entries(data).map(([code, name]) => ({
          code,
          name,
        }));
        setCurrencies(formattedCurrencies);
      } catch (error) {
        console.error("Error fetching currency list:", error);
        toast.error("An unexpected error occurred while fetching currency list.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const selectedCurrencyName = currencies.find(
    (currency) => currency.code === value
  )?.name;

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
          {selectedCurrencyName || value}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.code}
                  value={`${currency.name} (${currency.code})`}
                  onSelect={() => {
                    onValueChange(currency.code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === currency.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {currency.name} ({currency.code})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
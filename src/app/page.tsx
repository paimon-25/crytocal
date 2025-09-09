import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrencySelector } from "@/components/CurrencySelector";
import { BitcoinAmountInput } from "@/components/BitcoinAmountInput";
import { CryptoSelector } from "@/components/CryptoSelector"; // Import CryptoSelector

interface Item {
  name: string;
  priceUSD: number; // Base price in USD
  unit: string;
}

const everydayItems: Item[] = [
  { name: "Coffee", priceUSD: 4.50, unit: "cups" },
  { name: "Gallon of Gas", priceUSD: 3.25, unit: "gallons" },
  { name: "Netflix Subscription (monthly)", priceUSD: 15.99, unit: "months" },
  { name: "Grocery Trip", priceUSD: 85.00, unit: "trips" },
  { name: "Movie Ticket", priceUSD: 12.00, unit: "tickets" },
  { name: "Uber Ride (average)", priceUSD: 18.00, unit: "rides" },
  { name: "Rent (monthly average)", priceUSD: 1200.00, unit: "months" },
];

const currencySymbols: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  JPY: "¥",
  AUD: "A$",
  CHF: "CHF",
  CNY: "¥",
  SEK: "kr",
  NZD: "NZ$",
  MXN: "Mex$",
  SGD: "S$",
  HKD: "HK$",
  NOK: "kr",
  KRW: "₩",
  TRY: "₺",
  INR: "₹",
  RUB: "₽",
  BRL: "R$",
  ZAR: "R",
};

async function getCryptoPrice(cryptoId: string): Promise<{ price: number | null; name: string | null }> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`,
      { next: { revalidate: 60 } } // Revalidate every 60 seconds
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Failed to fetch price for ${cryptoId}:`, response.statusText, errorData);
      return { price: null, name: null };
    }
    const data = await response.json();
    const price = data[cryptoId]?.usd;

    // Fetch coin details to get the full name
    const coinDetailsResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${cryptoId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`,
      { next: { revalidate: 3600 } } // Revalidate hourly
    );
    let coinName = cryptoId; // Default to ID if name not found
    if (coinDetailsResponse.ok) {
      const coinDetails = await coinDetailsResponse.json();
      coinName = coinDetails.name || cryptoId;
    }

    return { price: price, name: coinName };
  } catch (error) {
    console.error(`Error fetching price for ${cryptoId}:`, error);
    return { price: null, name: null };
  }
}

async function getExchangeRate(targetCurrency: string): Promise<number> {
  if (targetCurrency === "USD") {
    return 1; // No conversion needed for USD
  }
  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=USD&to=${targetCurrency}`,
      { next: { revalidate: 3600 } } // Revalidate hourly
    );
    if (!response.ok) {
      console.error("Failed to fetch exchange rate:", response.statusText);
      return 1; // Fallback to 1 if fetch fails
    }
    const data = await response.json();
    if (data.rates && data.rates[targetCurrency]) {
      return data.rates[targetCurrency];
    } else {
      console.error(`Exchange rate for ${targetCurrency} not found in response. Full data:`, data);
      return 1; // Fallback
    }
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return 1; // Fallback
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { currency?: string; amount?: string; crypto?: string };
}) {
  const selectedCurrency = searchParams.currency?.toUpperCase() || "USD";
  const cryptoAmount = parseFloat(searchParams.amount || "1"); // Default to 1 if not provided or invalid
  const selectedCryptoId = searchParams.crypto || "bitcoin"; // Default to bitcoin

  const exchangeRate = await getExchangeRate(selectedCurrency);

  const { price: cryptoPriceUSD, name: cryptoName } = await getCryptoPrice(selectedCryptoId);
  const totalCryptoValue = cryptoPriceUSD !== null ? cryptoPriceUSD * cryptoAmount * exchangeRate : null;

  const currencySymbol = currencySymbols[selectedCurrency] || "$"; // Default to $ if symbol not found

  if (totalCryptoValue === null) {
    return (
      <div className="grid grid-rows-[1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-center sm:text-left">
            Crypto Purchasing Power Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center sm:text-left max-w-2xl">
            How many everyday items can you buy with the price of your chosen cryptocurrency?
            This calculator makes cryptocurrency prices relatable by comparing them
            to familiar purchases.
          </p>
          <div className="w-full text-center sm:text-left mb-8">
            <Badge variant="destructive" className="text-xl p-3">
              Could not load cryptocurrency price.
            </Badge>
          </div>
        </main>
        <MadeWithDyad />
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Crypto Purchasing Power Calculator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center sm:text-left max-w-2xl">
          How many everyday items can you buy with the price of your chosen cryptocurrency?
          This calculator makes cryptocurrency prices relatable by translating crypto values into tangible, everyday purchasing power.
        </p>

        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <Badge className="text-xl p-3">
            {cryptoAmount.toLocaleString("en-US", { maximumFractionDigits: 8 })} {cryptoName || selectedCryptoId} = {currencySymbol}
            {totalCryptoValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {selectedCurrency}
          </Badge>
          <div className="flex flex-col sm:flex-row gap-4">
            <BitcoinAmountInput />
            <CryptoSelector />
            <CurrencySelector />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {everydayItems.map((item) => {
            const convertedItemPrice = item.priceUSD * exchangeRate;
            const quantity = totalCryptoValue / convertedItemPrice;
            return (
              <Card key={item.name} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-primary">
                    {quantity.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-muted-foreground">
                    {item.unit} (
                    {currencySymbol}
                    {convertedItemPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    per {item.unit.endsWith("s") ? item.unit.slice(0, -1) : item.unit})
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
}
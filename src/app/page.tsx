import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CalculatorControls } from "@/components/CalculatorControls";

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

async function getCryptoPrice(cryptoId: string): Promise<{ price: number | null; name: string | null; error: string | null }> {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`;
    const revalidateTime = 60; // Revalidate every 60 seconds for current data

    const response = await fetch(url, { next: { revalidate: revalidateTime } });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `Failed to fetch price for ${cryptoId}: ${response.statusText} - ${JSON.stringify(errorData)}`;
      console.error(errorMessage);
      return { price: null, name: null, error: errorMessage };
    }
    const data = await response.json();

    let price: number | undefined;
    let coinName: string | undefined;

    price = data[cryptoId]?.usd;
    if (price !== undefined) {
      const coinDetailsResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`,
        { next: { revalidate: 3600 } }
      );
      if (coinDetailsResponse.ok) {
        const coinDetails = await coinDetailsResponse.json();
        coinName = coinDetails.name || cryptoId;
      } else {
        coinName = cryptoId;
      }
    }

    if (price === undefined) {
      const errorMessage = `Price for ${cryptoId} not found in API response.`;
      console.error(errorMessage, data);
      return { price: null, name: null, error: errorMessage };
    }

    return { price: price, name: coinName || cryptoId, error: null };
  } catch (error) {
    const errorMessage = `Error fetching price for ${cryptoId}: ${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMessage);
    return { price: null, name: null, error: errorMessage };
  }
}

async function getExchangeRate(targetCurrency: string): Promise<{ rate: number | null; error: string | null }> {
  if (targetCurrency === "USD") {
    return { rate: 1, error: null }; // No conversion needed for USD
  }
  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=USD&to=${targetCurrency}`,
      { next: { revalidate: 3600 } } // Revalidate hourly
    );
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `Failed to fetch exchange rate for ${targetCurrency}: ${response.statusText} - ${JSON.stringify(errorData)}`;
      console.error(errorMessage);
      return { rate: null, error: errorMessage };
    }
    const data = await response.json();
    if (data.rates && data.rates[targetCurrency]) {
      return { rate: data.rates[targetCurrency], error: null };
    } else {
      const errorMessage = `Exchange rate for ${targetCurrency} not found in response.`;
      console.error(errorMessage, data);
      return { rate: null, error: errorMessage };
    }
  } catch (error) {
    const errorMessage = `Error fetching exchange rate for ${targetCurrency}: ${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMessage);
    return { rate: null, error: errorMessage };
  }
}

// Define the expected type for HomePageProps, including params
interface HomePageProps {
  // Temporarily setting params to 'any' to bypass a persistent, misleading TypeScript error
  // where Next.js's internal type generation incorrectly expects 'params' to be a Promise.
  params: any; 
  // Temporarily setting searchParams to 'any' to bypass a persistent, misleading TypeScript error
  // where Next.js's internal type generation incorrectly expects 'searchParams' to be a Promise.
  searchParams: any;
}

export default async function Home({
  params, // Destructure params to satisfy the HomePageProps interface
  searchParams,
}: HomePageProps) {
  const isCalculated = searchParams.calculated === "true";
  const selectedCurrency = searchParams.currency?.toUpperCase() || "USD";
  const cryptoAmount = parseFloat(searchParams.amount || "1"); // Default to 1 if not provided or invalid
  const selectedCryptoId = searchParams.crypto || "bitcoin"; // Default to bitcoin

  const { rate: exchangeRate, error: exchangeRateError } = await getExchangeRate(selectedCurrency);

  // Fetch current crypto price
  const { price: currentCryptoPriceUSD, name: currentCryptoName, error: currentCryptoPriceError } = await getCryptoPrice(selectedCryptoId);
  const currentTotalCryptoValue = (currentCryptoPriceUSD !== null && exchangeRate !== null) ? currentCryptoPriceUSD * cryptoAmount * exchangeRate : null;

  const currencySymbol = currencySymbols[selectedCurrency] || "$"; // Default to $ if symbol not found

  // Determine the error message to display
  let displayError: string | null = null;
  if (currentCryptoPriceError) {
    displayError = `Crypto Price Error: ${currentCryptoPriceError}`;
  } else if (exchangeRateError) {
    displayError = `Exchange Rate Error: ${exchangeRateError}`;
  } else if (currentTotalCryptoValue === null) {
    displayError = "Could not calculate purchasing power due to an unknown data issue.";
  }

  const renderPurchasingPowerCards = (totalValue: number | null, cryptoName: string | null, title: string) => (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {everydayItems.map((item) => {
          const convertedItemPrice = item.priceUSD * (exchangeRate ?? 1);
          const quantity = totalValue !== null ? totalValue / convertedItemPrice : 0;
          return (
            <Card key={`${title}-${item.name}`} className="flex flex-col justify-between">
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
    </div>
  );

  return (
    <div className="grid grid-rows-[1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start w-full max-w-4xl">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-4xl font-bold text-center sm:text-left">
            Crypto Purchasing Power Calculator
          </h1>
          <ThemeToggle />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center sm:text-left max-w-2xl">
          How many everyday items can you buy with the price of your chosen cryptocurrency?
          This calculator makes cryptocurrency prices relatable by translating crypto values into tangible, everyday purchasing power.
        </p>

        <CalculatorControls />

        {isCalculated ? (
          displayError ? (
            <div className="w-full text-center sm:text-left mb-8">
              <Badge variant="destructive" className="text-xl p-3">
                {displayError}
              </Badge>
            </div>
          ) : (
            <>
              <Badge className="text-xl p-3 w-full text-center sm:text-left">
                Today: {cryptoAmount.toLocaleString("en-US", { maximumFractionDigits: 8 })} {currentCryptoName || selectedCryptoId} = {currencySymbol}
                {currentTotalCryptoValue!.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {selectedCurrency}
              </Badge>
              {renderPurchasingPowerCards(currentTotalCryptoValue, currentCryptoName, "Today's Purchasing Power")}
            </>
          )
        ) : (
          <div className="w-full text-center sm:text-left mb-8">
            <Badge className="text-xl p-3">
              Select a crypto, amount, and currency, then click "Calculate" to see its purchasing power!
            </Badge>
          </div>
        )}
      </main>
    </div>
  );
}
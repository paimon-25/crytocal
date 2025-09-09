import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // Import toast for notifications

interface Item {
  name: string;
  priceUSD: number;
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

async function getBitcoinPrice(): Promise<number | null> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      { next: { revalidate: 60 } } // Revalidate every 60 seconds to get fresh data
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch Bitcoin price:", response.statusText, errorData);
      toast.error("Failed to fetch Bitcoin price. Please try again later.");
      return null;
    }
    const data = await response.json();
    return data.bitcoin.usd;
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error);
    toast.error("An unexpected error occurred while fetching Bitcoin price.");
    return null;
  }
}

export default async function Home() {
  const bitcoinPrice = await getBitcoinPrice();

  if (bitcoinPrice === null) {
    return (
      <div className="grid grid-rows-[1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-center sm:text-left">
            Bitcoin Purchasing Power Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center sm:text-left max-w-2xl">
            How many everyday items can you buy with the price of one Bitcoin?
            This calculator makes cryptocurrency prices relatable by comparing them
            to familiar purchases.
          </p>
          <div className="w-full text-center sm:text-left mb-8">
            <Badge variant="destructive" className="text-xl p-3">
              Could not load Bitcoin price.
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
          Bitcoin Purchasing Power Calculator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center sm:text-left max-w-2xl">
          How many everyday items can you buy with the price of one Bitcoin?
          This calculator makes cryptocurrency prices relatable by translating crypto values into tangible, everyday purchasing power.
        </p>

        <div className="w-full text-center sm:text-left mb-8">
          <Badge className="text-xl p-3">
            1 Bitcoin = ${bitcoinPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {everydayItems.map((item) => {
            const quantity = bitcoinPrice / item.priceUSD;
            return (
              <Card key={item.name} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-primary">
                    {quantity.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-muted-foreground">{item.unit}</p>
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
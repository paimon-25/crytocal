"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDateParam = searchParams.get("date");

  const [date, setDate] = React.useState<Date | undefined>(
    selectedDateParam ? new Date(selectedDateParam) : undefined
  );

  React.useEffect(() => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("date") !== formattedDate) {
        params.set("date", formattedDate);
        router.push(`?${params.toString()}`);
      }
    } else if (selectedDateParam) {
      // If date is cleared, remove it from URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("date");
      router.push(`?${params.toString()}`);
    }
  }, [date, router, searchParams, selectedDateParam]);

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[180px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          captionLayout="dropdown-buttons"
          fromMonth={oneYearAgo} // Start selectable month from one year ago
          toMonth={today} // End selectable month at today
          disabled={(day) => day > today || day < oneYearAgo} // Disable dates outside the 1-year range
        />
      </PopoverContent>
    </Popover>
  );
}
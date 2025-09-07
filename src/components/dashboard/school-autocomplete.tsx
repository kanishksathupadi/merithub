
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

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
import { useDebounce } from "@/hooks/use-debounce";

interface SchoolAutocompleteProps {
    value: string;
    onValueChange: (value: string) => void;
}

interface SchoolResult {
    place_id: number;
    display_name: string;
    name: string;
}

export function SchoolAutocomplete({ value, onValueChange }: SchoolAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState<SchoolResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  React.useEffect(() => {
    if (debouncedSearchTerm.length < 3) {
      setResults([]);
      return;
    }

    const fetchSchools = async () => {
      setLoading(true);
      try {
        // We use viewbox to bias results towards North America, but it will still find global results.
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedSearchTerm)}&format=json&addressdetails=1&category=amenity&type=school,college,university&limit=10&viewbox=-125.0,49.0,-65.0,25.0&bounded=1`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Extract the name from the address for display
        const formattedData = data.map((item: any) => ({
            place_id: item.place_id,
            display_name: item.display_name,
            name: item.address.school || item.address.college || item.address.university || item.name
        }));
        setResults(formattedData);
      } catch (error) {
        console.error("Failed to fetch schools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [debouncedSearchTerm]);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{value || "Select school..."}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" side="bottom" align="start">
        <Command>
          <CommandInput 
            placeholder="Search for a school..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            />
          <CommandList>
            {loading && <div className="p-2 flex justify-center items-center"><Loader2 className="animate-spin" /></div>}
            {!loading && results.length === 0 && searchTerm.length > 2 && (
                <CommandEmpty>No school found.</CommandEmpty>
            )}
            <CommandGroup>
              {results.map((school) => (
                <CommandItem
                  key={school.place_id}
                  value={school.name}
                  onSelect={() => {
                    onValueChange(school.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.toLowerCase() === school.name.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div>
                    <p>{school.name}</p>
                    <p className="text-xs text-muted-foreground text-wrap">{school.display_name}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

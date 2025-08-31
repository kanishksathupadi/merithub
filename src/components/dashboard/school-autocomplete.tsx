
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

// In a real application, this would come from an API.
const schools = [
  { value: "northwood high school", label: "Northwood High School" },
  { value: "irvine high school", label: "Irvine High School" },
  { value: "university high school", label: "University High School" },
  { value: "woodbridge high school", label: "Woodbridge High School" },
  { value: "portola high school", label: "Portola High School" },
  { value: "beckman high school", label: "Beckman High School" },
];

interface SchoolAutocompleteProps {
    value: string;
    onValueChange: (value: string) => void;
}

export function SchoolAutocomplete({ value, onValueChange }: SchoolAutocompleteProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? schools.find((school) => school.label.toLowerCase() === value.toLowerCase())?.label
            : "Select school..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search school..." />
          <CommandList>
            <CommandEmpty>No school found.</CommandEmpty>
            <CommandGroup>
              {schools.map((school) => (
                <CommandItem
                  key={school.value}
                  value={school.label}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.toLowerCase() === school.label.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {school.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

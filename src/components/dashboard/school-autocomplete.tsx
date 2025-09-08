
"use client";

import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { validateSchoolName } from '@/ai/flows/validate-school-name';

interface School {
    place_id: number;
    display_name: string;
}

interface SchoolAutocompleteProps {
    value: string;
    onValueChange: (value: string) => void;
}

export function SchoolAutocomplete({ value, onValueChange }: SchoolAutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (debouncedSearchTerm.length > 2) {
            setIsLoading(true);
            validateSchoolName({ query: debouncedSearchTerm })
                .then(result => {
                    setSchools(result.schools);
                })
                .catch(err => {
                    console.error("Failed to fetch schools:", err);
                    setSchools([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setSchools([]);
        }
    }, [debouncedSearchTerm]);
    
    // When a value is selected, find its display name to show in the button
    const selectedSchoolDisplay = schools.find(school => school.display_name === value)?.display_name || value || "Select school...";

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal text-left"
                >
                    <span className="truncate">{selectedSchoolDisplay}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" side="bottom" align="start">
                <Command shouldFilter={false}>
                    <CommandInput 
                        placeholder="Search for your school..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                    />
                     <CommandList>
                        {isLoading && (
                            <div className="p-4 text-sm text-center">
                                <Loader2 className="animate-spin h-4 w-4 mx-auto"/>
                            </div>
                        )}
                        <CommandEmpty>
                            {!isLoading && debouncedSearchTerm.length > 2 && schools.length === 0 
                                ? "No school found." 
                                : "Type to search for your school."}
                        </CommandEmpty>
                        <CommandGroup>
                            {schools.map((school) => (
                                <CommandItem
                                    key={school.place_id}
                                    value={school.place_id.toString()}
                                    onSelect={() => {
                                        onValueChange(school.display_name);
                                        setSearchTerm(school.display_name);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === school.display_name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {school.display_name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

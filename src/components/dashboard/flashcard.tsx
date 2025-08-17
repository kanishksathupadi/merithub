
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { RotateCcw } from 'lucide-react';

interface FlashcardProps {
    term: string;
    definition: string;
}

export function Flashcard({ term, definition }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="w-full max-w-lg h-80 perspective-1000">
            <div 
                className={cn(
                    "relative w-full h-full transition-transform duration-700 transform-style-3d",
                    isFlipped ? "rotate-y-180" : ""
                )}
            >
                {/* Front of the card (Term) */}
                <Card 
                    className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center cursor-pointer"
                    onClick={handleFlip}
                >
                    <CardContent className="p-6 text-center">
                        <h2 className="text-3xl font-bold">{term}</h2>
                    </CardContent>
                </Card>
                
                {/* Back of the card (Definition) */}
                <Card 
                    className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-secondary cursor-pointer"
                    onClick={handleFlip}
                >
                    <CardContent className="p-6 text-center">
                        <p className="text-lg">{definition}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

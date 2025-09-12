
"use client";

import { motion } from "framer-motion";
import * as icons from "lucide-react";

type StatCardProps = {
  icon: keyof typeof icons;
  value: number;
  label: string;
};

export const StatCard = ({ icon, value, label }: StatCardProps) => {
    const Icon = icons[icon] as React.ElementType;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center p-6 bg-card rounded-xl shadow-lg border border-border"
        >
            <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mb-4">
                {Icon && <Icon className="w-8 h-8" />}
            </div>
            <p className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-foreground/80">
                {value.toLocaleString()}
            </p>
            <p className="text-muted-foreground mt-2 text-sm text-center h-10 flex items-center">{label}</p>
        </motion.div>
    );
};

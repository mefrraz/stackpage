"use client";

import { useEffect } from "react";
import { THEMES, ThemeId } from "@/lib/themes";

export function ThemeWrapper({ themeId }: { themeId: string }) {
    useEffect(() => {
        const theme = THEMES[themeId as ThemeId] || THEMES['luminous'];
        const root = document.documentElement;

        // Apply colors
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
        });

        // Apply radius and fonts
        root.style.setProperty('--radius', theme.radius);

        // Map Heading/Body/Mono fonts to Tailwind vars
        // Note: The font-* classes use these variables.
        root.style.setProperty('--font-sans', theme.fontHeading);
        root.style.setProperty('--font-mono', theme.fontBody); // Assuming fontBody might be mono for some cyberpunk themes, or we should split

    }, [themeId]);

    return null; // This component handles side-effects only (style injection)
}

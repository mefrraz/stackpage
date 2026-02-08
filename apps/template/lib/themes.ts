export type ThemeId = 'luminous' | 'swiss' | 'cyberpunk' | 'neo-brutalism';

export interface Theme {
    id: ThemeId;
    name: string;
    colors: {
        background: string;
        foreground: string;
        primary: string;
        secondary: string;
        border: string;
        card: string;
    };
    radius: string;
    fontHeading: string;
    fontBody: string;
}

export const THEMES: Record<ThemeId, Theme> = {
    luminous: {
        id: 'luminous',
        name: 'Luminous Glass',
        colors: {
            background: '#09090b',
            foreground: '#fafafa',
            primary: '#c084fc',
            secondary: '#27272a',
            border: '#27272a',
            card: 'rgba(9, 9, 11, 0.6)'
        },
        radius: '0.75rem',
        fontHeading: 'var(--font-inter)',
        fontBody: 'var(--font-inter)'
    },
    swiss: {
        id: 'swiss',
        name: 'Swiss Minimal',
        colors: {
            background: '#ffffff',
            foreground: '#000000',
            primary: '#000000',
            secondary: '#f0f0f0',
            border: '#e5e5e5',
            card: '#ffffff'
        },
        radius: '0px',
        fontHeading: 'var(--font-inter)',
        fontBody: 'var(--font-inter)'
    },
    cyberpunk: {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        colors: {
            background: '#050505',
            foreground: '#00ff41',
            primary: '#fdf500', // Yellow
            secondary: '#1a1a1a',
            border: '#00ff41',
            card: '#000000'
        },
        radius: '0px',
        fontHeading: 'var(--font-jetbrains)',
        fontBody: 'var(--font-jetbrains)'
    },
    'neo-brutalism': {
        id: 'neo-brutalism',
        name: 'Neo Brutalism',
        colors: {
            background: '#fff1f2', // soft pink
            foreground: '#000000',
            primary: '#4f46e5', // Indigo
            secondary: '#ffffff',
            border: '#000000',
            card: '#ffffff'
        },
        radius: '0.5rem',
        fontHeading: 'var(--font-inter)',
        fontBody: 'var(--font-jetbrains)'
    }
};

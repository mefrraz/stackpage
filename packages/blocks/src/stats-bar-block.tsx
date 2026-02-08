"use client";

import React from 'react';

export interface Stat {
    value: string;
    label: string;
}

export interface StatsBarBlockProps {
    stats?: Stat[];
    paddingTop?: string;
    paddingBottom?: string;
}

const defaultStats: Stat[] = [
    { value: '10K+', label: 'Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
    { value: '50+', label: 'Countries' },
];

export const StatsBarBlock: React.FC<StatsBarBlockProps> = ({
    stats = defaultStats,
    paddingTop = '40px',
    paddingBottom = '40px',
}) => {
    return (
        <section style={{ paddingTop, paddingBottom }} className="w-full px-6">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="text-center p-6 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

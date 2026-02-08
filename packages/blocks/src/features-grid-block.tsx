"use client";

import React from 'react';
import { Zap, Shield, Clock, Star, Users, Globe, Rocket, Heart, Code, Lock, Laptop, CheckCircle } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, any> = {
    zap: Zap,
    shield: Shield,
    clock: Clock,
    star: Star,
    users: Users,
    globe: Globe,
    rocket: Rocket,
    heart: Heart,
    code: Code,
    lock: Lock,
    laptop: Laptop,
    check: CheckCircle,
};

export interface Feature {
    icon?: string;
    title: string;
    description: string;
}

export interface FeaturesGridBlockProps {
    title?: string;
    subtitle?: string;
    features?: Feature[];
    columns?: 2 | 3 | 4;
    paddingTop?: string;
    paddingBottom?: string;
}

const defaultFeatures: Feature[] = [
    { icon: 'zap', title: 'Blazing Fast', description: 'Optimized for speed and performance.' },
    { icon: 'shield', title: 'Secure', description: 'Enterprise-grade security built-in.' },
    { icon: 'clock', title: '24/7 Support', description: 'We are here when you need us.' },
];

export const FeaturesGridBlock: React.FC<FeaturesGridBlockProps> = ({
    title,
    subtitle,
    features = defaultFeatures,
    columns = 3,
    paddingTop = '60px',
    paddingBottom = '60px',
}) => {
    const gridCols = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
    };

    return (
        <section style={{ paddingTop, paddingBottom }} className="w-full px-6">
            <div className="max-w-6xl mx-auto">
                {(title || subtitle) && (
                    <div className="text-center mb-12 space-y-3">
                        {title && <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>}
                        {subtitle && <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{subtitle}</p>}
                    </div>
                )}

                <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
                    {features.map((feature, idx) => {
                        const IconComponent = ICON_MAP[feature.icon || 'star'] || Star;
                        return (
                            <div
                                key={idx}
                                className="group p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <IconComponent className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

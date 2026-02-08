"use client";

import React from 'react';
import { Button } from '@stackpage/ui';

// Inline SVG to bypass React types version mismatch
const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

export interface PricingTier {
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    highlighted?: boolean;
    ctaText?: string;
    ctaLink?: string;
}

export interface PricingCardsBlockProps {
    title?: string;
    subtitle?: string;
    tiers?: PricingTier[];
    paddingTop?: string;
    paddingBottom?: string;
}

const defaultTiers: PricingTier[] = [
    {
        name: 'Starter',
        price: '€0',
        period: '/mês',
        description: 'Perfeito para começar',
        features: ['1 site', '1GB storage', 'Support via email'],
        ctaText: 'Começar Grátis',
    },
    {
        name: 'Pro',
        price: '€19',
        period: '/mês',
        description: 'Para profissionais',
        features: ['10 sites', '50GB storage', 'Priority support', 'Custom domain', 'Analytics'],
        highlighted: true,
        ctaText: 'Upgrade to Pro',
    },
    {
        name: 'Enterprise',
        price: '€99',
        period: '/mês',
        description: 'Para equipas grandes',
        features: ['Unlimited sites', '500GB storage', '24/7 phone support', 'SSO', 'Dedicated manager'],
        ctaText: 'Contact Sales',
    },
];

export const PricingCardsBlock: React.FC<PricingCardsBlockProps> = ({
    title,
    subtitle,
    tiers = defaultTiers,
    paddingTop = '60px',
    paddingBottom = '60px',
}) => {
    return (
        <section style={{ paddingTop, paddingBottom }} className="w-full px-6">
            <div className="max-w-6xl mx-auto">
                {(title || subtitle) && (
                    <div className="text-center mb-12 space-y-3">
                        {title && <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>}
                        {subtitle && <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{subtitle}</p>}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tiers.map((tier, idx) => (
                        <div
                            key={idx}
                            className={`
                                p-6 rounded-2xl border flex flex-col
                                ${tier.highlighted
                                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20 scale-[1.02]'
                                    : 'border-border/40 bg-card/30'
                                }
                            `}
                        >
                            {tier.highlighted && (
                                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                            {tier.description && (
                                <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                            )}

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold">{tier.price}</span>
                                {tier.period && (
                                    <span className="text-muted-foreground text-sm">{tier.period}</span>
                                )}
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {tier.features.map((feature, fidx) => (
                                    <li key={fidx} className="flex items-center gap-2 text-sm">
                                        <CheckIcon className="w-4 h-4 text-primary shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={tier.highlighted ? 'default' : 'outline'}
                                className="w-full rounded-xl"
                                onClick={() => tier.ctaLink && window.location.assign(tier.ctaLink)}
                            >
                                {tier.ctaText || 'Get Started'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

"use client";

import React from 'react';
import { Button } from '@stackpage/ui';

export interface HeroBlockProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
    paddingTop?: string;
    paddingBottom?: string;
}

export const HeroBlock: React.FC<HeroBlockProps> = ({
    title,
    subtitle,
    backgroundImage,
    ctaText,
    ctaLink,
    paddingTop = '80px',
    paddingBottom = '80px',
}) => {
    return (
        <section
            className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden"
            style={{ paddingTop, paddingBottom }}
        >
            {/* Background Image with Overlay */}
            {backgroundImage && (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                    <div className="absolute inset-0 bg-background/80 z-0" />
                </>
            )}

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                )}

                {ctaText && (
                    <div className="pt-6">
                        <Button
                            size="lg"
                            onClick={() => ctaLink && window.location.assign(ctaLink)}
                            className="h-12 px-8 text-base font-medium rounded-md"
                        >
                            {ctaText}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};

"use client";

import React from 'react';
import { Button } from '@stackpage/ui';

export interface HeroBlockProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
}

export const HeroBlock: React.FC<HeroBlockProps> = ({
    title,
    subtitle,
    backgroundImage,
    ctaText,
    ctaLink,
}) => {
    return (
        <section className="relative w-full py-20 px-6 flex flex-col items-center justify-center text-center bg-gray-100 overflow-hidden min-h-[400px]">
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 opacity-50"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                )}

                {ctaText && (
                    <div className="pt-4">
                        <Button onClick={() => ctaLink && window.location.assign(ctaLink)}>
                            {ctaText}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};

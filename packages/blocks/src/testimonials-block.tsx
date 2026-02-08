"use client";

import React from 'react';

// Inline SVGs to bypass React types version mismatch
const QuoteIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

export interface Testimonial {
    quote: string;
    author: string;
    role?: string;
    avatar?: string;
    rating?: number;
}

export interface TestimonialsBlockProps {
    title?: string;
    testimonials?: Testimonial[];
    paddingTop?: string;
    paddingBottom?: string;
}

const defaultTestimonials: Testimonial[] = [
    {
        quote: "This product changed the way we work. Absolutely incredible experience!",
        author: "Maria Silva",
        role: "CEO, TechCorp",
        rating: 5,
    },
    {
        quote: "Fast, reliable, and the support team is amazing. Highly recommended.",
        author: "João Santos",
        role: "Developer",
        rating: 5,
    },
    {
        quote: "We saw a 200% increase in productivity after switching. Best decision ever.",
        author: "Ana Costa",
        role: "Product Manager",
        rating: 5,
    },
];

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
    title,
    testimonials = defaultTestimonials,
    paddingTop = '60px',
    paddingBottom = '60px',
}) => {
    return (
        <section style={{ paddingTop, paddingBottom }} className="w-full px-6">
            <div className="max-w-6xl mx-auto">
                {title && (
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-tight">
                        {title}
                    </h2>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, idx) => (
                        <div
                            key={idx}
                            className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm flex flex-col"
                        >
                            <QuoteIcon className="w-8 h-8 text-primary/30 mb-4" />

                            {testimonial.rating && (
                                <div className="flex gap-1 mb-3">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <StarIcon key={i} className="w-4 h-4 fill-primary text-primary" />
                                    ))}
                                </div>
                            )}

                            <p className="text-foreground/90 mb-6 flex-1 leading-relaxed">
                                "{testimonial.quote}"
                            </p>

                            <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-medium">
                                    {testimonial.avatar ? (
                                        <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        testimonial.author[0]
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{testimonial.author}</p>
                                    {testimonial.role && (
                                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

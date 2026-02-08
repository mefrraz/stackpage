"use client";

import React, { useState } from 'react';

// Inline SVG to bypass React types version mismatch
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);

export interface GalleryImage {
    src: string;
    alt?: string;
    caption?: string;
}

export interface GalleryMasonryBlockProps {
    images?: GalleryImage[];
    columns?: 2 | 3 | 4;
    paddingTop?: string;
    paddingBottom?: string;
}

const defaultImages: GalleryImage[] = [
    { src: 'https://picsum.photos/600/400?random=1', alt: 'Project 1' },
    { src: 'https://picsum.photos/600/800?random=2', alt: 'Project 2' },
    { src: 'https://picsum.photos/600/500?random=3', alt: 'Project 3' },
    { src: 'https://picsum.photos/600/600?random=4', alt: 'Project 4' },
    { src: 'https://picsum.photos/600/450?random=5', alt: 'Project 5' },
    { src: 'https://picsum.photos/600/700?random=6', alt: 'Project 6' },
];

export const GalleryMasonryBlock: React.FC<GalleryMasonryBlockProps> = ({
    images = defaultImages,
    columns = 3,
    paddingTop = '40px',
    paddingBottom = '40px',
}) => {
    const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

    const columnClasses = {
        2: 'columns-1 sm:columns-2',
        3: 'columns-1 sm:columns-2 lg:columns-3',
        4: 'columns-1 sm:columns-2 lg:columns-4',
    };

    return (
        <>
            <section style={{ paddingTop, paddingBottom }} className="w-full px-6">
                <div className="max-w-6xl mx-auto">
                    <div className={`${columnClasses[columns]} gap-4`}>
                        {images.map((image, idx) => (
                            <div
                                key={idx}
                                className="break-inside-avoid mb-4 group cursor-pointer"
                                onClick={() => setLightboxImage(image)}
                            >
                                <div className="relative overflow-hidden rounded-xl border border-border/40">
                                    <img
                                        src={image.src}
                                        alt={image.alt || `Gallery image ${idx + 1}`}
                                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                    {image.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-sm">{image.caption}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        onClick={() => setLightboxImage(null)}
                    >
                        <CloseIcon />
                    </button>
                    <img
                        src={lightboxImage.src}
                        alt={lightboxImage.alt}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};

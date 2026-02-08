import React from 'react';

export interface ImageBlockProps {
    url?: string;
    alt?: string;
    caption?: string;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ url, alt = "Image", caption }) => {
    if (!url) {
        return (
            <div className="w-full h-64 bg-muted/30 flex items-center justify-center border-2 border-dashed border-muted rounded-md select-none">
                <p className="text-muted-foreground text-sm">Sem imagem selecionada</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center my-8">
            <img
                src={url}
                alt={alt}
                className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                loading="lazy"
            />
            {caption && (
                <p className="text-sm text-muted-foreground mt-2 text-center italic">
                    {caption}
                </p>
            )}
        </div>
    );
};

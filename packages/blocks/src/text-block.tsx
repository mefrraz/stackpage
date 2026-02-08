
import React from 'react';

export interface TextBlockProps {
    content?: string;
    align?: 'left' | 'center' | 'right';
}

export const TextBlock: React.FC<TextBlockProps> = ({ content = "Start writing...", align = 'left' }) => {
    return (
        <div className={`prose max-w-none w-full px-6 py-4 text-${align}`}>
            {/* Simple pre-wrap text for now, can be upgraded to HTML/Markdown later */}
            <div className="whitespace-pre-wrap">{content}</div>
        </div>
    );
};

import React from 'react';

export interface SpacerBlockProps {
    height?: number; // px
}

export const SpacerBlock: React.FC<SpacerBlockProps> = ({ height = 50 }) => {
    return <div style={{ height: `${height}px` }} className="w-full" />;
};

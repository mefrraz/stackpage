import React from 'react';
import { Block } from './types';
import { HeroBlock } from './hero-block';

const BLOCK_MAP: Record<string, React.FC<any>> = {
    hero: HeroBlock,
    // text: TextBlock,
    // image: ImageBlock,
};

export interface BlockRendererProps {
    blocks: Block[];
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
    if (!blocks || blocks.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col w-full">
            {blocks.map((block) => {
                const Component = BLOCK_MAP[block.type];

                if (!Component) {
                    console.warn(`Unknown block type: ${block.type}`);
                    return null;
                }

                return <Component key={block.id} {...block.props} />;
            })}
        </div>
    );
};

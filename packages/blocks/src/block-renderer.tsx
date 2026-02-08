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
    wrapper?: (props: { block: Block; children: React.ReactNode }) => React.ReactNode;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks, wrapper }) => {
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

                const content = <Component key={block.id} {...block.props} />;

                // Se houver um wrapper (ex: lógica de seleção do editor), usa-o.
                // Caso contrário, retorna apenas o bloco.
                if (wrapper) {
                    return <React.Fragment key={block.id}>{wrapper({ block, children: content })}</React.Fragment>;
                }

                return content;
            })}
        </div>
    );
};

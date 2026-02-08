import React from 'react';
import { Block, BlockType } from './types';
import { HeroBlock } from './hero-block';
import { SpacerBlock } from './spacer-block';
import { TextBlock } from './text-block';
import { FeaturesGridBlock } from './features-grid-block';
import { LinkButtonsBlock } from './link-buttons-block';
import { StatsBarBlock } from './stats-bar-block';
import { TestimonialsBlock } from './testimonials-block';
import { PricingCardsBlock } from './pricing-cards-block';
import { GalleryMasonryBlock } from './gallery-masonry-block';

const DEFAULT_BLOCK_MAP: Record<string, React.FC<any>> = {
    hero: HeroBlock,
    spacer: SpacerBlock,
    text: TextBlock,
    'features-grid': FeaturesGridBlock,
    'link-buttons': LinkButtonsBlock,
    'stats-bar': StatsBarBlock,
    testimonials: TestimonialsBlock,
    'pricing-cards': PricingCardsBlock,
    'gallery-masonry': GalleryMasonryBlock,
    // post-grid: (Defined in app via customComponents)
};

export interface BlockRendererProps {
    blocks: Block[];
    wrapper?: (props: { block: Block; children: React.ReactNode }) => React.ReactNode;
    customComponents?: Partial<Record<BlockType | string, React.FC<any>>>;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks, wrapper, customComponents }) => {
    if (!blocks || blocks.length === 0) {
        return null;
    }

    const mergedMap = { ...DEFAULT_BLOCK_MAP, ...customComponents };

    return (
        <div className="flex flex-col w-full">
            {blocks.map((block) => {
                const Component = mergedMap[block.type];

                if (!Component) {
                    console.warn(`Unknown block type: ${block.type}`);
                    return (
                        <div key={block.id} className="p-4 border border-dashed border-red-300 text-red-500 text-sm">
                            Unknown block: {block.type}
                        </div>
                    );
                }

                // Handle common styles (e.g., advanced spacing)
                const style: React.CSSProperties = {};
                if (block.props?.paddingTop) style.paddingTop = block.props.paddingTop;
                if (block.props?.paddingBottom) style.paddingBottom = block.props.paddingBottom;

                const content = (
                    <div style={style} className="w-full">
                        <Component key={block.id} {...block.props} />
                    </div>
                );

                // If wrapper provided (e.g. editor selection logic)
                if (wrapper) {
                    return <React.Fragment key={block.id}>{wrapper({ block, children: content })}</React.Fragment>;
                }

                return <React.Fragment key={block.id}>{content}</React.Fragment>;
            })}
        </div>
    );
};

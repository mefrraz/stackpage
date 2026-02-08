export type BlockType = 'hero' | 'text' | 'image' | 'post-list' | 'spacer' | 'post-grid' | 'features-grid' | 'link-buttons' | 'stats-bar' | 'testimonials' | 'pricing-cards' | 'gallery-masonry';

export interface Block {
    id: string;
    type: BlockType;
    props: Record<string, any>;
}

export interface BlockProps<T = any> {
    id: string;
    type: BlockType;
    props: T;
}

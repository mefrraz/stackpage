export type BlockType = 'hero' | 'text' | 'image' | 'post-list' | 'spacer' | 'post-grid';

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

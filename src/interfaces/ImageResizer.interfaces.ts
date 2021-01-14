export interface ImageResizerOptions {
    type: string;
    id: string;
    name: string;
    size: 'small' | 'medium' | 'large';
}

export interface ImageConfig {
    width?: number;
    height?: number;
    upsize?: boolean;
    quality?: number;
    types?: string[];
    output?: string;
}

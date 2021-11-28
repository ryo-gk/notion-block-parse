export declare function blockToHTML(blocks: Block[]): string;
export declare function createHTML(block: Block): any;
export declare function createElementParagraph(block: ParagraphBlock): string;
export declare function createElementHeadingOne(block: HeadingOneBlock): string;
export declare function createElementHeadingTwo(block: HeadingTwoBlock): string;
export declare function createElementHeadingThree(block: HeadingThreeBlock): string;
export declare function createElementCallout(block: CalloutBlock): string;
export declare function getElementIcon(icon: Icon): string;
export declare function createElementQuote(block: QuoteBlock): string;
export declare function createElementBalletedListItem(block: BalletedListItemBlock): string;
export declare function createElementNumberedListItem(block: NumberedListItemBlock): string;
export declare function createElementToDo(block: ToDoBlock): string;
export declare function createElementToggle(block: ToggleBlock): string;
export declare function createElementCode(block: CodeBlock): string;
export declare function createElementImage(block: ImageBlock): string;
export declare function createElementVideo(block: VideoBlock): string;
export declare function createElementDefault(block: Block): any;
export interface Block {
    id: string;
    type: BlockType;
}
export declare type BlockType = 'paragraph' | 'quote' | 'code' | 'heading_1' | 'heading_2' | 'heading_3' | 'callout' | 'bulleted_list_item' | 'numbered_list_item' | 'to_do' | 'toggle' | 'child_page' | 'child_database' | 'embed' | 'image' | 'video' | 'file' | 'pdf' | 'bookmark' | 'unsupported';
export interface Text {
    type: 'text' | 'mention' | 'quation';
    plain_text: string;
}
export interface ParagraphBlock extends Block {
    type: 'paragraph';
    paragraph: {
        text: Text[];
    };
}
export interface HeadingOneBlock extends Block {
    type: 'heading_1';
    heading_1: {
        text: Text[];
    };
}
export interface HeadingTwoBlock extends Block {
    type: 'heading_2';
    heading_2: {
        text: Text[];
    };
}
export interface HeadingThreeBlock extends Block {
    type: 'heading_3';
    heading_3: {
        text: Text[];
    };
}
export interface CalloutBlock extends Block {
    type: 'callout';
    callout: {
        text: Text[];
        icon: Icon;
    };
}
export interface Icon {
    type: 'emoji' | 'file' | 'external';
    emoji?: any;
    file?: {
        url: string;
        expiry_time: string;
    };
    external?: {
        url: string;
    };
}
export interface QuoteBlock extends Block {
    type: 'quote';
    quote: {
        text: Text[];
    };
}
export interface BalletedListItemBlock extends Block {
    type: 'bulleted_list_item';
    bulleted_list_item: {
        text: Text[];
        children: Block[];
    };
}
export interface NumberedListItemBlock extends Block {
    type: 'numbered_list_item';
    numbered_list_item: {
        text: Text[];
        children: Block[];
    };
}
export interface ToDoBlock extends Block {
    type: 'to_do';
    to_do: {
        text: Text[];
        checked: boolean;
        children: Block[];
    };
}
export interface ToggleBlock extends Block {
    type: 'toggle';
    toggle: {
        text: Text[];
        children: Block[];
    };
}
export interface CodeBlock extends Block {
    type: 'code';
    code: {
        text: Text[];
        language: string;
    };
}
export interface ImageBlock extends Block {
    type: 'image';
    image: File;
}
export interface File {
    type: 'file' | 'external';
    caption?: Text;
    file?: {
        url: string;
        expiry_time: string;
    };
    external?: {
        url: string;
    };
}
export interface VideoBlock extends Block {
    type: 'video';
    video: File;
}

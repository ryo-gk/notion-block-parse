export function blockToHTML(blocks: Block[]) {
  return blocks.reduce((html: string, block: Block) => {

    html += createHTML(block)

    return html
  }, '')
}

export function createHTML(block: Block) {
  const { type } = block

  switch(type) {
    case 'paragraph':
      return createElementParagraph(block as ParagraphBlock)
    case 'heading_1':
      return createElementHeadingOne(block as HeadingOneBlock)
    case 'heading_2':
      return createElementHeadingTwo(block as HeadingTwoBlock)
    case 'heading_3':
      return createElementHeadingThree(block as HeadingThreeBlock)
    case 'callout':
      return createElementCallout(block as CalloutBlock)
    case 'quote':
      return createElementQuote(block as QuoteBlock)
    case 'bulleted_list_item':
      return createElementBalletedListItem(block as BalletedListItemBlock)
    case 'code':
      return createElementCode(block as CodeBlock)
    case 'toggle':
      return createElementToggle(block as ToggleBlock)
    default:
      return createElementDefault(block)
  }
}

function createElementParagraph(block: ParagraphBlock) {
  const texts = block.paragraph.text

  return texts
    .map(text => wrapWithTag('p', text.plain_text))
    .join('')
}

function createElementHeadingOne(block: HeadingOneBlock) {
  const texts = block.heading_1.text

  return texts
    .map(text => wrapWithTag('h1', text.plain_text))
    .join('')
}

function createElementHeadingTwo(block: HeadingTwoBlock) {
  const texts = block.heading_2.text

  return texts
    .map(text => wrapWithTag('h2', text.plain_text))
    .join('')
}

function createElementHeadingThree(block: HeadingThreeBlock) {
  const texts = block.heading_3.text

  return texts
    .map(text => wrapWithTag('h3', text.plain_text))
    .join('')
}

function createElementCallout(block: CalloutBlock) {
  const text = block.callout.text.map(text => text.plain_text).join('')
  const icon = getElementIcon(block.callout.icon)

  return wrapWithTag('div', icon + wrapWithTag('div', text), { classes: ['callout']})
}

function getElementIcon(icon: Icon) {
  switch(icon.type) {
    case 'emoji':
      return wrapWithTag('span', icon.emoji, { classes: ['emoji'], attrs: [['role', ['image']], ['aria-label', [icon.emoji]]]})
    case 'file':
      return wrapWithTag('img', '', { attrs: [['src', [icon.file.url]]]}) 
    case 'external':
      return wrapWithTag('img', '', { attrs: [['src', [icon.external.url]]]})
  }
}

function createElementQuote(block: QuoteBlock) {
  const texts = block.quote.text

  const content = texts
    .map(text => wrapWithTag('p', text.plain_text))
    .join('')

  return wrapWithTag('blockquote', content)
}

function createElementBalletedListItem(block: BalletedListItemBlock) {
  const text = block.bulleted_list_item.text.map(text => text.plain_text).join('')
  const children = block.bulleted_list_item.children

  if (children) {
    const childElement = children ? blockToHTML(children) : ''

    return wrapWithTag('div', text, { classes: ['bulleted-list-item']})
      + wrapWithTag('div', childElement, { classes: ['bulleted-list-item_child']})
  }

  return wrapWithTag('div', text, { classes: ['bulleted-list-item']})
}

function createElementCode(block: CodeBlock) {
  const text = block.code.text.map(text => text.plain_text).join('')
  const language = block.code.language

  return wrapWithTag('pre', wrapWithTag('code', text), { classes: [language]})
}

function createElementToggle(block: ToggleBlock) {
  const text = block.toggle.text.map(text => text.plain_text).join('')
  const children = block.toggle.children

  if (children) {
    const childElement = children ? blockToHTML(children) : ''

    return wrapWithTag('div', text, { classes: ['toggle']})
    + wrapWithTag('div', childElement, { classes: ['toggle_child']})
  }

  return wrapWithTag('div', text, { classes: ['toggle']})
}

function createElementDefault(block: Block) {
  return (block as any)[block.type].text.map((text: any) => text.plain_text).join() ?? ''
}

function wrapWithTag (
  tag: string,
  content: string,
  options?: {
    classes?: string[],
    attrs?: [string, string[]][]
  }
) {
  const classes = options && options.classes && options.classes.length > 0
    ? ` class="${options.classes.join(' ')}"`
    : ''

  const attrs = options && options.attrs && options.attrs.length > 0
    ? ` ${toAttrs(options.attrs)}`
    : ''

  const start = `<${tag}${classes}${attrs}>`
  const end = `</${tag}>`
  return `${start}${content}${end}`
}

function toAttrs(attrs: [string, string[]][]) {
  return attrs.reduce((carry: string, attr: [string, string[]]) => {
    carry += ` ${attr[0]}="${attr[1].join(' ')}"`

    return carry
  }, '')
}

export interface Block {
  id: string
  type: BlockType
}

export interface Text {
  type: 'text' | 'mention' | 'quation'
  plain_text: string
}

export interface ParagraphBlock extends Block {
  type: 'paragraph'
  paragraph: {
    text: Text[]
  }
}

export interface HeadingOneBlock extends Block {
  type: 'heading_1'
  heading_1: {
    text: Text[]
  }
}

export interface HeadingTwoBlock extends Block {
  type: 'heading_2'
  heading_2: {
    text: Text[]
  }
}

export interface HeadingThreeBlock extends Block {
  type: 'heading_3'
  heading_3: {
    text: Text[]
  }
}

export interface CalloutBlock extends Block {
  type: 'callout'
  callout: {
    text: Text[]
    icon : Icon
  }
}

export interface Icon {
  type: 'emoji' | 'file' | 'external'
  emoji?: any
  file?: {
    url: string
    expiry_time: string
  }
  external?: {
    url: string
  }
}

export interface QuoteBlock extends Block {
  type: 'quote'
  quote: {
    text: Text[]
  }
}

export interface BalletedListItemBlock extends Block {
  type: 'bulleted_list_item'
  bulleted_list_item: {
    text: Text[]
    children: Block[]
  }
}

export interface ToggleBlock extends Block {
  type: 'toggle'
  toggle: {
    text: Text[],
    children: Block[]
  }
}

export interface CodeBlock extends Block {
  type: 'code'
  code: {
    text: Text[]
    language: string
  }
}

export type BlockType = 'paragraph' | 'quote' | 'code' | 'heading_1' | 'heading_2' |
  'heading_3' | 'callout' | 'bulleted_list_item' | 'numbered_list_item' |
  'to_do' | 'toggle' | 'child_page' |
  'child_database' | 'embed' | 'image' |
  'video' | 'file' | 'pdf' | 'bookmark' | 'unsupported'
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
    case 'numbered_list_item':
      return createElementNumberedListItem(block as NumberedListItemBlock)
    case 'to_do':
      return createElementToDo(block as ToDoBlock)
    case 'toggle':
      return createElementToggle(block as ToggleBlock)
    case 'code':
        return createElementCode(block as CodeBlock)
    case 'image':
      return createElementImage(block as ImageBlock)
    case 'video':
      return createElementVideo(block as VideoBlock)
    default:
      return createElementDefault(block)
  }
}

export function createElementParagraph(block: ParagraphBlock) {
  const texts = block.paragraph.text

  return texts
    .map(text => wrapWithTag('p', text.plain_text))
    .join('')
}

export function createElementHeadingOne(block: HeadingOneBlock) {
  const texts = block.heading_1.text

  return texts
    .map(text => wrapWithTag('h1', text.plain_text))
    .join('')
}

export function createElementHeadingTwo(block: HeadingTwoBlock) {
  const texts = block.heading_2.text

  return texts
    .map(text => wrapWithTag('h2', text.plain_text))
    .join('')
}

export function createElementHeadingThree(block: HeadingThreeBlock) {
  const texts = block.heading_3.text

  return texts
    .map(text => wrapWithTag('h3', text.plain_text))
    .join('')
}

export function createElementCallout(block: CalloutBlock) {
  const text = block.callout.text.map(text => text.plain_text).join('')
  const icon = getElementIcon(block.callout.icon)

  return wrapWithTag('div', icon + wrapWithTag('div', text), { classes: ['callout']})
}

export function getElementIcon(icon: Icon) {
  switch(icon.type) {
    case 'emoji':
      return wrapWithTag('span', icon.emoji, { classes: ['emoji'], attrs: [['role', ['image']], ['aria-label', [icon.emoji]]]})
    case 'file':
      return wrapWithTag('img', '', { attrs: [['src', [icon.file.url]]]}) 
    case 'external':
      return wrapWithTag('img', '', { attrs: [['src', [icon.external.url]]]})
  }
}

export function createElementQuote(block: QuoteBlock) {
  const texts = block.quote.text

  const content = texts
    .map(text => wrapWithTag('p', text.plain_text))
    .join('')

  return wrapWithTag('blockquote', content)
}

export function createElementBalletedListItem(block: BalletedListItemBlock) {
  const text = block.bulleted_list_item.text.map(text => text.plain_text).join('')
  const children = block.bulleted_list_item.children

  if (children) {
    const childElement = children ? blockToHTML(children) : ''

    return wrapWithTag('div', text, { classes: ['bulleted-list-item']})
      + wrapWithTag('div', childElement, { classes: ['bulleted-list-item_child']})
  }

  return wrapWithTag('div', text, { classes: ['bulleted-list-item']})
}

export function createElementNumberedListItem(block: NumberedListItemBlock) {
  const text = block.numbered_list_item.text.map(text => text.plain_text).join('')
  const children = block.numbered_list_item.children

  if (children) {
    const childElement = children ? blockToHTML(children) : ''

    return wrapWithTag('div', text, { classes: ['numbered-list-item']})
      + wrapWithTag('div', childElement, { classes: ['numbered-list-item_child']})
  }

  return wrapWithTag('div', text, { classes: ['numbered-list-item']})
}

export function createElementToDo(block: ToDoBlock) {
  const text = block.to_do.text.map(text => text.plain_text).join('')
  const checked = block.to_do.checked
  const children = block.to_do.children
  
  const attrs: [string, string[]][] = [
    ['type', ['checkbox']]
  ]
  checked && attrs.push(['checked', ['']])

  if (children) {
    const childElement = children ? blockToHTML(children) : ''

    return wrapWithTag(
      'div',
      wrapWithTag(
        'input',
        wrapWithTag('span', text, { classes: ['to-do_text']}),
        { classes: ['to-do_checkbox'], attrs }
      ),
      { classes: ['to-do']}
    ) + wrapWithTag('div', childElement, { classes: ['to-do_child']})
  }

  return wrapWithTag(
    'div',
    wrapWithTag(
      'input',
      wrapWithTag('span', text, { classes: ['to-do_text']}),
      { classes: ['to-do_checkbox'], attrs }
    ),
    { classes: ['to-do']}
  )
}

export function createElementToggle(block: ToggleBlock) {
  const text = block.toggle.text.map(text => text.plain_text).join('')
  const children = block.toggle.children

  if (children) {
    const childElement = children ? blockToHTML(children) : ''

    return wrapWithTag('div', text, { classes: ['toggle']})
    + wrapWithTag('div', childElement, { classes: ['toggle_child']})
  }

  return wrapWithTag('div', text, { classes: ['toggle']})
}

export function createElementCode(block: CodeBlock) {
  const text = block.code.text.map(text => text.plain_text).join('')
  const language = block.code.language

  return wrapWithTag('pre', wrapWithTag('code', text), { classes: [language]})
}

export function createElementImage(block: ImageBlock) {
  const imageElement = getElementImage(block.image)
  const caption = block.image.caption[0]?.plain_text
  
  if (caption) {
    return wrapWithTag(
      'div',
      imageElement + wrapWithTag('div', caption, { classes: ['caption']}),
      { classes: ['image']}
    )
  }

  return wrapWithTag('div', imageElement, { classes: ['image']})
}

function getElementImage(image: File) {
  switch(image.type) {
    case 'file':
      return wrapWithTag('img', '', { attrs: [['src', [image.file.url]]]})
    case 'external':
      return wrapWithTag('img', '', { attrs: [['src', [image.external.url]]]})
  }
}

export function createElementVideo(block: VideoBlock) {
  const videoElement = getElementVideo(block.video)
  const caption = block.video.caption[0]?.plain_text

  if (caption) {
    return wrapWithTag(
      'div',
      videoElement + wrapWithTag('div', caption, { classes: ['caption']}),
      { classes: ['video']}
    )
  }

  return wrapWithTag('div', videoElement, { classes: ['video']})
}

function getElementVideo(video: File) {
  switch(video.type) {
    case 'file':
      return wrapWithTag(
        'iframe',
        '',
        { attrs: [
          ['src', [video.file.url]],
          ['frameborder', ['0']],
          ['allowfullscreen', ['']]
        ]}
      )
    case 'external':
      return wrapWithTag(
        'iframe',
        '',
        { attrs: [
          ['src', [video.external.url]],
          ['frameborder', ['0']],
          ['allowfullscreen', ['']]
        ]}
      )
  }
}


export function createElementDefault(block: Block) {
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

export type BlockType = 'paragraph' | 'quote' | 'code' | 'heading_1' | 'heading_2' |
  'heading_3' | 'callout' | 'bulleted_list_item' | 'numbered_list_item' |
  'to_do' | 'toggle' | 'child_page' |
  'child_database' | 'embed' | 'image' |
  'video' | 'file' | 'pdf' | 'bookmark' | 'unsupported'

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

export interface NumberedListItemBlock extends Block {
  type: 'numbered_list_item'
  numbered_list_item: {
    text: Text[]
    children: Block[]
  }
}

export interface ToDoBlock extends Block {
  type: 'to_do'
  to_do: {
    text: Text[]
    checked: boolean
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

export interface ImageBlock extends Block {
  type: 'image'
  image: File
}

export interface File {
  type: 'file' | 'external'
  caption?: Text
  file?: {
    url: string
    expiry_time: string
  }
  external?: {
    url: string
  }
}

export interface VideoBlock extends Block {
  type: 'video'
  video: File
}

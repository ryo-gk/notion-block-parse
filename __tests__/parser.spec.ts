import {
  blockToHTML,
  CodeBlock,
  ParagraphBlock,
  QuoteBlock,
  ToggleBlock
} from '../lib/parser'

describe('parser', () => {
  describe('block', () => {
    test('paragraph block', () => {
      const block: ParagraphBlock = {
        id: 'XXX',
        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              plain_text: 'This is a paragraph text.'
            }
          ]
        }
      }

      const html = blockToHTML([block])
      expect(html).toEqual('<p><span>This is a paragraph text.</span></p>')
    })

    test('quote block', () => {
      const block: QuoteBlock = {
        id: 'XXX',
        type: 'quote',
        quote: {
          text: [
            {
              type: 'text',
              plain_text: 'This is a quoted text.'
            }
          ]
        }
      }

      const html = blockToHTML([block])
      expect(html).toEqual(
        '<blockquote><p><span>This is a quoted text.</span></p></blockquote>'
      )
    })

    test('code block', () => {
      const block: CodeBlock = {
        id: 'XXX',
        type: 'code',
        code: {
          text: [
            {
              type: 'text',
              plain_text: "console.log('This is a code block.')"
            }
          ],
          language: 'javascript'
        }
      }

      const html = blockToHTML([block])
      expect(html).toEqual(
        '<pre class="javascript"><code>console.log(\'This is a code block.\')</code></pre>'
      )
    })

    test('toggle block', () => {
      const block: ToggleBlock = {
        id: 'XXX',
        type: 'toggle',
        toggle: {
          text: [],
          children: []
        }
      }
    })
  })
})

import { closify } from './closify.js'
import { minify } from './minify.js'
import { hasHtml, validateConfig } from './utils.js'
import { CONFIG } from './constants.js'

/**
 * @type {boolean}
 */
let strict

/**
 * @type {{ line: string[] }}
 */
const convert = {
  line: []
}

/**
 * Isolate tags, content, and comments.
 * 
 * @param {string} html The HTML string to evaluate.
 * @returns {string}
 * @example <div>Hello World!</div> => 
 *  [#-# : 0 : <div> : #-#]
 *  Hello World!
 *  [#-# : 1 : </div> : #-#]
 */
const enqueue = (html) => {
  convert.line = []
  let i = -1

  html = html.replace(/<[^>]*>/g, (match) => {
    convert.line.push(match)
    i++

    return `\n[#-# : ${i} : ${match} : #-#]\n`
  })

  return html
}

/**
 * Preprocess the HTML.
 * 
 * @param {string} html The HTML string to preprocess.
 * @returns {string}
 */
const preprocess = (html) => {
  html = closify(html, false)
  html = minify(html, false)
  html = enqueue(html)

  return html
}

/**
 * 
 * @param {string} html The HTML string to process.
 * @param {number} step 
 * @returns {string}
 */
const process = (html, step) => {
  /* Track current number of indentations needed. */
  let indents = ''

  /* Process lines and indent. */
  convert.line.forEach((source, index) => {
    html = html
      .replace(/\n+/g, '\n') /* Replace consecutive line returns with singles. */
      .replace(`[#-# : ${index} : ${source} : #-#]`, (match) => {
        let subtrahend = 0
        const prevLine = `[#-# : ${index - 1} : ${convert.line[index - 1]} : #-#]`

        /**
         * Arbitratry character, to keep track of the string's length.
         */
        indents += '0'
        
        if (index === 0) subtrahend++

        /* We're processing a closing tag. */
        if (match.indexOf(`#-# : ${index} : </`) > -1) subtrahend++

        /* prevLine is a doctype declaration. */
        if (prevLine.indexOf('<!doctype') > -1) subtrahend++

        /* prevLine is a comment. */
        if (prevLine.indexOf('<!--') > -1) subtrahend++

        /* prevLine is a self-closing tag. */
        if (prevLine.indexOf('/> : #-#') > -1) subtrahend++

        /* prevLine is a closing tag. */
        if (prevLine.indexOf(`#-# : ${index - 1} : </`) > -1) subtrahend++

        /* Determine offset for line indentation. */
        const offset = indents.length - subtrahend

        /* Adjust for the next round. */
        indents = indents.substring(0, offset)

        /* Remove comment. */
        if (strict && match.indexOf('<!--') > -1) return ''

        /* Remove the prefix and suffix, leaving the content. */
        const result = match
          .replace(`[#-# : ${index} : `, '')
          .replace(' : #-#]', '')

        /* Pad the string with spaces and return. */
        return result.padStart(result.length + (step * offset))
      })
  })

  /* Remove line returns, tabs, and consecutive spaces within html elements or their content. */
  html = html.replace(/>[^<]*?[^><\/\s][^<]*?<\/|>\s+[^><\s]|<script[^>]*>\s+<\/script>|<(\w+)>\s+<\/(\w+)|<([\w\-]+)[^>]*[^\/]>\s+<\/([\w\-]+)>/g,
    match => match.replace(/\n|\t|\s{2,}/g, '')
  )

  /* Remove self-closing nature of void elements. */
  if (strict) html = html.replace(/\s\/>/g, '>')

  const lead_newline_check = html.substring(0, 1)
  const tail_newline_check = html.substring(html.length - 1)

  /**
   * Remove single leading and trailing new line, if they exist.
   * These will be `false` if the "html" being processed is only plain text. 
   */
  if (lead_newline_check === '\n') html = html.substring(1, html.length)
  if (tail_newline_check === '\n') html = html.substring(0, html.length - 1)

  return html
}

/**
 * Format HTML with line returns and indentations.
 * 
 * @param {string} html The HTML string to prettify.
 * @param {import('htmlfy').Config} [config] A configuration object.
 * @returns {string} A well-formed HTML string.
 */
export const prettify = (html, config) => {
  const validated_config = config ? validateConfig(config) : CONFIG
  strict = validated_config.strict

  /* Return content as-is if it does not contain any HTML elements. */
  if (!hasHtml(html)) return html

  html = preprocess(html)
  html = process(html, validated_config.tab_size)

  return html
}

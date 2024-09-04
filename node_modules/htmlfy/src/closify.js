import { hasHtml } from "./utils.js"

const void_elements = [
  'area', 'base', 'br', 'col', 'embed', 'hr', 
  'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr'
]

/**
 * Ensure void elements are "self-closing".
 * 
 * @param {string} html The HTML string to evaluate.
 * @param {boolean} html_check Check to see if the content contains any HTML, before processing.
 * @returns {string}
 * @example <br> => <br />
 */
export const closify = (html, html_check = true) => {
  if (html_check)
    if (!hasHtml(html)) return html
  
  return html.replace(/<([a-zA-Z\-0-9]+)[^>]*>/g, (match, name) => {
    if (void_elements.indexOf(name) > -1) {
      return (`${match.substring(0, match.length - 1)} />`).replace(/\/\s\//g, '/')
    }

    return match.replace(/[\s]?\/>/g, `></${name}>`)
  })
}
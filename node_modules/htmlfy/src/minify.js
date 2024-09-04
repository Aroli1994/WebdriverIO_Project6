import { entify } from "./entify.js"
import { hasHtml } from "./utils.js"

/**
 * Creates a single-line HTML string
 * by removing line returns, tabs, and relevant spaces.
 * 
 * @param {string} html The HTML string to minify.
 * @param {boolean} html_check Check to see if the content contains any HTML, before processing.
 * @returns {string} A minified HTML string.
 */
export const minify = (html, html_check = true) => {
  if (html_check)
    if (!hasHtml(html)) return html

  /**
   * Ensure textarea content is specially minified and protected
   * before general minification.
   */
  html = entify(html)

  /* All other minification. */
  return html
    .replace(/\n|\t/g, '')
    .replace(/[a-z]+="\s*"/ig, '')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .replace(/\s>/g, '>')
    .replace(/<\s\//g, '</')
    .replace(/>\s/g, '>')
    .replace(/\s</g, '<')
    .replace(/class=["']\s/g, (match) => match.replace(/\s/g, ''))
    .replace(/(class=.*)\s(["'])/g, '$1'+'$2')
}

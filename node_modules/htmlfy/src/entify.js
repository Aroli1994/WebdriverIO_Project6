/**
 * Enforce entity characters for textarea content.
 * By default, this also does basic minification before setting entities.
 * For full minification, pass `minify_content` as `true`.
 * 
 * @param {string} html The HTML string to evaluate.
 * @param {boolean} [minify] Fully minifies the content of textarea elements. 
 * Defaults to `false`. We recommend a value of `true` if you're running `entify()` 
 * as a standalone function.
 * @returns {string}
 * @example <textarea>3 > 2</textarea> => <textarea>3 &gt; 2</textarea>
 */
export const entify = (html, minify = false) => {
  /* Trim any combination of leading line returns and/or spaces. */
  html = html
    .replace(/(<textarea[^>]*>)\n+/g, '$1')
    .replace(/(<textarea[^>]*>)\n\s+/g, '$1')
    .replace(/(<textarea[^>]*>)\s+\n/g, '$1')

  /* Trim trailing spaces */
  html = html.replace(/\s+<\/textarea>/g, '</textarea>')

  /** 
   * Protect entities, inside the textarea content,
   * from general minification.
   */
  html = html.replace(/<textarea[^>]*>((.|\n)*?)<\/textarea>/g, (match, capture) => {
    return match.replace(capture, (match) => {
      return match
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#47;')
        .replace(/"/g, '&#34;')
        .replace(/'/g, '&#39;')
        .replace(/\n/g, '&#13;')
        .replace(/%/g, '&#37;')
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;')
    })
  })

  /* Typical minification, but only for textareas. */
  if (minify) {
    html = html.replace(/<textarea[^>]*>((.|\n)*?)<\/textarea>/g, (match, capture) => {
      /* Replace things inside the textarea content. */
      match = match.replace(capture, (match) => {
        return match
          .replace(/\n|\t/g, '')
          .replace(/[a-z]+="\s*"/ig, '')
          .replace(/>\s+</g, '><')
          .replace(/\s+/g, ' ')
      })

      /* Replace things in the entire element */
      match = match
        .replace(/\s+/g, ' ')
        .replace(/\s>/g, '>')
        .replace(/>\s/g, '>')
        .replace(/\s</g, '<')
        .replace(/class=["']\s/g, (match) => match.replace(/\s/g, ''))
        .replace(/(class=.*)\s(["'])/g, '$1'+'$2')
      return match
    })
  }

  return html
}

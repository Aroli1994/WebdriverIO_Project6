# htmlfy
HTML formatter yo! Prettify, minify and more!

`htmlfy` is a fork of [html-formatter](https://github.com/uznam8x/html-formatter/tree/master). Most of the processing logic has been preserved, and full credit for that goes to the original author. I've made the following major enhancements.

- Fully typed.
- Converted to ESM.
- Configuration options.
- A lot of naming changes.

## Install

`npm install htmlfy`

## API

### Prettify
Turn single-line or ugly HTML into highly formatted HTML. This is a wrapper for all other functions, and then it adds indentation.

```js
import { prettify } from 'htmlfy'

const html = `<main class="hello   there world"><div>Welcome to htmlfy!  </div></main>`
console.log(prettify(html))
/*
<main class="hello there world">
  <div>
    Welcome to htmlfy!
  </div>
</main>
*/
```

### Minify
Turn well-formatted or ugly HTML into a single-line of HTML.

```js
import { minify } from 'htmlfy'

const html = 
`<main class="hello there world">
  <div>
    Welcome to htmlfy!
  </div>
</main>`
console.log(minify(html))
/*
<main class="hello there world"><div>Welcome to htmlfy!</div></main>
*/
```

### Closify
Ensure [void elements](https://developer.mozilla.org/en-US/docs/Glossary/Void_element) are "self-closing".

```js
import { closify } from 'htmlfy'

const html = `<br><input type="text">`
console.log(closify(html))
/*
<br /><input type="text" />
*/
```

### Entify
Enforce entity characters for textarea content. This also performs basic minification on textareas before setting entities. When running this function as a standalone, you'll likely want to pass `minify` as `true` for full minification of the textarea. The minification does not process any other tags.

```js
import { entify } from 'htmlfy'

const html = `<main class="hello   there world"><div>Welcome to htmlfy!  </div></main><textarea  >

Did   you know that 3 >   2?

This is another paragraph.   


</textarea><textarea class="  more  stuff  ">    </textarea>`
console.log(entify(html, true))
/*
<main class="hello   there world"><div>Welcome to htmlfy!  </div></main><textarea>Did you know that 3 &gt; 2?&#13;&#13;This is another paragraph.</textarea><textarea class="more stuff"></textarea>
*/
```

### Default Import
If needed, you can use a default import for `htmlfy`.

```js
import * as htmlfy from 'htmlfy'

console.log(htmlfy.prettify('<main><div>Hello World</div></main'))
```

## Configuration
These configuration options can only be passed to `prettify`.

Default config:
```js
{
  strict: false,
  tab_size: 2
}
```

### Strict
If set to `true`, removes comments and ensures void elements are not self-closing.

```js
import { prettify } from 'htmlfy'

const html = `<main><br /><div><!-- Hello World --></div></main>`
console.log(prettify(html, { strict: true }))
/*
<main>
  <br>
  <div></div>
</main>
*/
```

### Tab Size
Determines the number of spaces, per tab, for indentation.

```js
import { prettify } from 'htmlfy'

const html = `<main class="hello   there world"><div>Welcome to htmlfy!  </div></main>`
console.log(prettify(html, { tab_size: 4 }))
/*
<main class="hello there world">
    <div>
        Welcome to htmlfy!
    </div>
</main>
*/
```

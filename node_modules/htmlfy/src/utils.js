import { CONFIG } from './constants.js'

/**
 * Checks if content contains at least one HTML element.
 * 
 * @param {string} content Content to evaluate.
 * @returns {boolean} A boolean.
 */
export const hasHtml = (content) => {
  const regex = /<(?<Element>[A-Za-z]+\b)[^>]*(?:.|\n)*?<\/{1}\k<Element>>/
  return regex.test(content)
}

/**
 * Generic utility which merges two objects.
 * 
 * @param {any} current Original object.
 * @param {any} updates Object to merge with original.
 * @returns {any}
 */
const mergeObjects = (current, updates) => {
  if (!current || !updates)
    throw new Error("Both 'current' and 'updates' must be passed-in to merge()")
  if (typeof current !== 'object' || typeof updates !== 'object' || Array.isArray(current) || Array.isArray(updates))
    throw new Error("Both 'current' and 'updates' must be passed-in as objects to merge()")

  let merged = { ...current }

  for (let key of Object.keys(updates)) {
    if (typeof updates[key] !== 'object') {
      merged[key] = updates[key]
    } else {
      /* key is an object, run mergeObjects again. */
      merged[key] = mergeObjects(merged[key] || {}, updates[key])
    }
  }

  return merged
}

/**
 * Merge a user config with the default config.
 * 
 * @param {import('types').DefaultConfig} dconfig The default config.
 * @param {import('htmlfy').Config} config The user config.
 * @returns {import('types').ValidatedConfig}
 */
export const mergeConfig = (dconfig, config) => {
  /**
   * We need to make a deep copy of `dconfig`,
   * otherwise we end up altering the original `CONFIG` because `dconfig` is a reference to it.
   */
  return mergeObjects(structuredClone(dconfig), config)
}

/**
 * Validate any passed-in config options and merge with CONFIG.
 * 
 * @param {import('htmlfy').Config} config A user config.
 * @returns {import('types').ValidatedConfig} A validated config.
 */
export const validateConfig = (config) => {
  if (typeof config !== 'object') throw 'Config must be an object.'

  const config_empty = !(Object.hasOwn(config, 'tab_size') || Object.hasOwn(config, 'strict'))
  if (config_empty) return CONFIG

  let tab_size = config.tab_size

  if (tab_size) {
    if (typeof tab_size !== 'number') throw 'Tab size must be a number.'
    const safe = Number.isSafeInteger(tab_size)
    if (!safe) throw `Tab size ${tab_size} is not safe. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger for more info.`

    /** 
     * Round down, just in case a safe floating point,
     * like 4.0, was passed.
     */
    tab_size = Math.floor(tab_size)
    if (tab_size < 1 || tab_size > 16) throw 'Tab size out of range. Expecting 1 to 16.'
  
    config.tab_size = tab_size
  }

  if (Object.hasOwn(config, 'strict') && typeof config.strict !== 'boolean') throw 'Strict config must be a boolean.' 

  return mergeConfig(CONFIG, config)

}

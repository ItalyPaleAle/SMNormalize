import regex from './data/regex'

/** Options for normalizer */
export interface NormalizeOptions {
    /**
     * Mode of operation:
     * - "basic" removes diacritics only from letters
     * - "alphabetic" removes all characters that are not alphabetic (in all scripts)
     * - "latin" removes all characters that are not in the latin alphabet
     * 
     * In all modes, all whitespaces are converted to normal space characters.
     * 
     * Default value: `basic`
     */
    mode?: 'basic' | 'alphabetic' | 'latin'

    /**
     * Additional characters to preserve. By default, this is `-_.` (dash, underscore and dot). This is ignored when in `basic` mode.
     */
    preserveCharacters?: string

    /** Remove numbers. Default value: `false`. This has no effect in `basic` mode, as that never removes numbers. */
    removeNumbers?: boolean

    /** Keep emoji characters. Default value: `false`. This has no effect in `basic` mode, as that doesn't remove characters.. */
    keepEmojis?: boolean

    /** Lowercase the output string. Default value: `false` */
    lowercase?: boolean
}

/**
 * Normalizes a string
 * 
 * @param str - Source string
 * @param options - Dictionary of options
 * @returns The normalized string
 */
export function Normalize(str: string, options?: NormalizeOptions): string {
    // Default values
    if (!options) {
        options = {}
    }
    if (!options.mode) {
        options.mode = 'basic'
    }
    if (options.preserveCharacters === undefined) {
        options.preserveCharacters = '-_.'
    }

    // 1. Decompose Unicode sequences
    str = str.normalize('NFD')

    // 2. Normalize the string based on the chosen method
    let key

    // Replacer function that preserves some characters, if any
    const replacer = (str: string): string =>
        options.preserveCharacters.indexOf(str) < 0 ? '' : str
    switch (options.mode) {
        case 'basic':
            // Remove all sequences that are in the "Mark" category
            str = str.replace(regex.basic, '')
            break

        case 'alphabetic':
            // Remove all characters that are not Alphabetic or Spacing
            key = 'alphabetic' +
                (!options.removeNumbers ? '+numbers' : '') +
                (options.keepEmojis ? '+emoji' : '')
                if (options.preserveCharacters) {
                    str = str.replace(regex[key], replacer)
                }
                else {
                    str = str.replace(regex[key], '')
                }
            break

        case 'latin':
            // Remove all characters that are not Alphabetic or Spacing
            key = 'latin' +
                (!options.removeNumbers ? '+numbers' : '') +
                (options.keepEmojis ? '+emoji' : '')
                if (options.preserveCharacters) {
                    str = str.replace(regex[key], replacer)
                }
                else {
                    str = str.replace(regex[key], '')
                }
            break

        default:
            throw Error('Invalid mode')
    }

    // 3. Replace all spacing characters with normal spaces
    str = str.replace(regex.spacing, ' ')

    // 4. Compose the Unicode sequences again
    str = str.normalize('NFC')

    // 5. Optionally lowercase the string
    if (options.lowercase) {
        str = str.toLowerCase()
    }

    return str
}

module.exports = {Normalize}

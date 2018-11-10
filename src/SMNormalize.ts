import regex from './data/regex'

/** Options for normalizer */
export interface NormalizeOptions {
    /**
     * Mode of operation:
     * - "basic" removes diacritics only from letters
     * - "alphabetic" removes all characters that are not alphabetic (in all scripts)
     * - "latin" removes all characters that are not in the latin alphabet
     * 
     * In all modes, control characters and whitespaces are removed; spaces are converted to the character specified in `spaceConversion`
     * 
     * Default value: `basic`
     */
    mode?: 'basic' | 'alphabetic' | 'latin'

    /**
     * Defines the character spaces (codepoint 0x20) are converted to. By default, this is `-` (dash). To preserve spaces as is, set this to ` `. Set to an empty string or null to remove all spaces entirely.
     * Note that all other spacing characters (including newlines, tabs, etc) are removed.
     */
    convertSpaces?: string | null

    /**
     * Additional characters to preserve. By default, this is `-_.` (dash, underscore and dot). This is ignored when in `basic` mode.
     */
    preserveCharacters?: string

    /**
     * Remove numbers. Default value: `false`. This has no effect in `basic` mode, as that never removes numbers. 
     */
    removeNumbers?: boolean

    /**
     * Keep emoji characters. Default value: `false`. This has no effect in `basic` mode, as that doesn't remove characters..
     */
    keepEmojis?: boolean

    /**
     * Lowercase the output string. Default value: `false`
     */
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
    if (options.convertSpaces === undefined) {
        options.convertSpaces = '-'
    }
    else if (options.convertSpaces === null) {
        options.convertSpaces = ''
    }

    // 1. Decompose Unicode sequences
    str = str.normalize('NFD')

    // 2. Normalize the string based on the chosen method
    let key

    // Replacer function that converts spaces to the "convertSpace" character, and preserves those characters in the "preserveCharacter" list
    const replacer = (val: string): string =>
        val === ' ' ?
            options.convertSpaces :
            options.preserveCharacters.indexOf(val) < 0 ? '' : val

    switch (options.mode) {
        case 'basic':
            // Remove all sequences that are in the "mark" category
            str = str.replace(regex.basic, replacer)
            break

        case 'alphabetic':
            // Remove all characters that are not alphabetic
            key = 'alphabetic' +
                (!options.removeNumbers ? '+numbers' : '') +
                (options.keepEmojis ? '+emoji' : '')
            str = str.replace(regex[key], replacer)
            break

        case 'latin':
            // Remove all characters that are not in the latin alphabet
            // When emojis are enabled, 0-9 numbers are always included
            key = 'latin' +
                ((!options.removeNumbers && !options.keepEmojis) ? '+numbers' : '') +
                (options.keepEmojis ? '+emoji' : '')
            str = str.replace(regex[key], replacer)
            break

        default:
            throw Error('Invalid mode')
    }

    // 3. Compose the Unicode sequences again
    str = str.normalize('NFC')

    // 4. Optionally lowercase the string
    if (options.lowercase) {
        str = str.toLowerCase()
    }

    return str
}

// tslint:disable-next-line
module.exports = {Normalize}

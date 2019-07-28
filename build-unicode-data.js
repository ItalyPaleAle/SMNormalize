'use strict'

const regenerate = require('regenerate')
const fs = require('fs')

// Require the modules with the data we need
const unicodePackageVersion = '12.1.0'
const sets = {
    // Marks (incl. diacritics)
    marks: require('unicode-' + unicodePackageVersion + '/General_Category/Mark/code-points.js'),

    // Spacing characters
    spacing: require('unicode-' + unicodePackageVersion + '/General_Category/Space_Separator/code-points.js'),

    // Alphabetic characters
    alphabetic: require('unicode-' + unicodePackageVersion + '/Binary_Property/Alphabetic/code-points.js'),

    // Latin characters
    latin: require('unicode-' + unicodePackageVersion + '/Script/Latin/code-points.js'),

    // Numbers
    numbers: require('unicode-' + unicodePackageVersion + '/General_Category/Number/code-points.js'),

    // Control characters
    control: require('unicode-' + unicodePackageVersion + '/General_Category/Control/code-points.js'),

    // Emoji
    emoji: require('unicode-' + unicodePackageVersion + '/Binary_Property/Emoji/code-points.js')
}

// Negates the class in the regular expression
const negateClass = (str) => '[^' + str.substr(1)

// Build the regular expressions we need
const regExs = {
    // Basic mode: just removes marks, as well as spacing and control characters (blacklisting characters)
    'basic': regenerate(sets.marks, sets.spacing, sets.control, ' ')
        .toString({hasUnicodeFlag: true}),

    // In all other modes, we are whistelisting characters
    // Numbers are the entire sets.numbers for alphabetic, and only 0-9 for latin
    'alphabetic': negateClass(
            regenerate(sets.alphabetic)
                .toString({hasUnicodeFlag: true})
        ),
    'alphabetic+numbers': negateClass(
            regenerate(sets.alphabetic, sets.numbers)
                .toString({hasUnicodeFlag: true})
        ),
    'alphabetic+emoji': negateClass(
            regenerate(sets.alphabetic, sets.emoji)
                .toString({hasUnicodeFlag: true})
        ),
    'alphabetic+numbers+emoji': negateClass(
            regenerate(sets.alphabetic, sets.numbers, sets.emoji)
                .toString({hasUnicodeFlag: true})
        ),
    'latin': negateClass(
            regenerate(sets.latin)
                .toString({hasUnicodeFlag: true})
        ),
    'latin+numbers': negateClass(
            regenerate(sets.latin)
                .addRange(0x30, 0x39)
                .toString({hasUnicodeFlag: true})
        ),
    'latin+emoji': negateClass(
            regenerate(sets.latin, sets.emoji)
                .toString({hasUnicodeFlag: true})
        ),
    // This is the same as latin+emoji
    /*'latin+numbers+emoji': negateClass(
            regenerate(sets.latin, sets.emoji)
                .addRange(0x30, 0x39)
                .toString({hasUnicodeFlag: true}
        ))*/
}

let output = 'export default {\n'
for (let e in regExs) {
    if (!regExs.hasOwnProperty(e)) {
        continue
    }

    output += "    '" + e + "': /" + regExs[e] + "/ug,\n"
}
output += '}\n'

fs.writeFileSync('src/data/regex.ts', output)

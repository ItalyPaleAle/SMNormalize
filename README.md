# SMNormalize

[![Dependency Status](https://david-dm.org/ItalyPaleAle/SMNormalize.svg?style=flat)](https://david-dm.org/ItalyPaleAle/SMNormalize)
[![devDependency Status](https://david-dm.org/ItalyPaleAle/SMNormalize/dev-status.svg?style=flat)](https://david-dm.org/ItalyPaleAle/SMNormalize#info=devDependencies)

String normalization utilities for Unicode strings and ids.

In a world where everyone types in Unicode (including emojis!), there are many things to consider when you accept input from users and are, for example, planning to use input strings as identifiers. For example, when dealing with tags, ids, labels, titles… When dealing with these situations, there a few common issues:

- Form: the characters `è` and `è` might look identical, but they are in two separate byte sequences, and need to be normalized or string comparisons will fail (see [Unicode equivalence](https://en.wikipedia.org/wiki/Unicode_equivalence))
- Diacritics (accents): sometimes you'll want to remove accents and other diacritics from characters, for example turning `über` into `uber`, and `papà` into `papa`
- Remove non-letter characters: SMNormalize allows you to remove all characters that are not letters or numbers, in any alphabet used around the world – or just in the latin one
- Keep emojis: you can optionally keep emojis, because who doesn't love emojis as identifiers? 🙃

Data used by this module is based on **Unicode 12.0.0**, released in March 2019.

This module is written in TypeScript and transpiled to JavaScript. All typings are available alongside the code.

This code is licensed under the terms of the MIT license (see LICENSE.md).

## Full documentation

Full documentation is available on [GitHub pages](https://italypaleale.github.io/SMNormalize/).

## Add to your project

Install from NPM:

````sh
npm install --save smnormalize
````

## API Guide

The module exports symbols as named exports.

### Normalize(str, options)

````js
const {Normalize} = require('smnormalize')

Normalize(str, options)
````

The method accepts an input string `str` and normalizes it by removing all diacritics/accents, and ensuring that the resulting string is normalized in the NFC (canonical composition) form. In addition to that, you can perform other operations depending on the mode of operation.

The `options` argument is an object with the following properties:

- **`options.mode`** is the mode of operation, and could be one of the following:
  - **`'basic'`** (this is the default value): in this mode, all diacritics/accents are removed from the string, and the string is nornalized in the NFC form. Whitespaces, including newlines, tabs, etc, are removed; spaces are converted to the character defined in `options.preserveCharacters`. All control characters (unprintable characters) are removed too.
  - **`'alphabetic'`** in addition to what basic mode does, all characters that are not letters (in any script/alphabet) are removed, including symbols, spaces, etc.
  - **`'latin'`** similar to the alphabetic mode, but only allows letters that are part of the latin alphabet.
- **`options.removeNumbers`** (boolean, default: `false`) when false, numbers are always allowed. In alphabetic mode, every kind of number is preserved, while in latin mode only latin numbers are allowed (0-9). This option has no effect in basic mode.
- **`options.allowEmoji`** (boolean, default: `false`) if true, does not remove emojis from identifiers. Note that the characters `0-9` (latin numbers) are considered valid emojis, and so are preserved regardless of the value of `options.removeNumbers`. This option has no effect in basic mode.
- **`options.convertSpaces`** (string, default: `-`) character to replace the space character (codepoint 0x20) with. To preserve spaces as is, set this to `' '` (a single space character). You can set it to `null` or to an empty string to remove spaces entirely. Note that other whitespace characters, such as newlines, tabs, etc, are removed as part of the basic normalization.
- **`options.preserveCharacters`** (string, default: `-_.`) optional list of individual characters that should not be removed, regardless of modes of operation. By default, this includes the dash `-`, the underscore `_` and the dot `.`. You can disable this by setting this to an empty string.
- **`options.lowercase`** (boolean, default: `false`) optionally lowercases the string before returning it.

To show the difference between multiple modes of operation and options, consider this string as example: <br> `Hello Шѻrld_!1߁🤗`

|  | "basic" mode | "alphabetic" mode | "latin" mode |
|-------------------------------------------|------------------|-------------------|--------------|
| removeNumbers = false, keepEmojis = false | `Hello-Шѻrld_!1߁🤗` | `Hello-Шѻrld_1߁` | `Hello-rld_1` |
| removeNumbers = true, keepEmojis = false | `Hello-Шѻrld_!1߁🤗` | `Hello-Шѻrld_` | `Hello-rld_` |
| removeNumbers = false, keepEmojis = true | `Hello-Шѻrld_!1߁🤗` | `Hello-Шѻrld_1߁🤗` | `Hello-rld_1🤗` |
| removeNumbers = true, keepEmojis = true | `Hello-Шѻrld_!1߁🤗` | `Hello-Шѻrld_1🤗` | `Hello-rld_1🤗` |

Note that in basic mode the `removeNumbers` and `keepEmojis` options have no effect, because no characters (aside from whitespaces and control characters) are removed. In alphabetic and latin mode, latin numbers are always present when emojis are allowed (but not numbers in other scripts); also, note that the exclamation mark was removed, but the underscore was kept ebcause it's in the `preserveCharacters` list.

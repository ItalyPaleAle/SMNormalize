import 'mocha'
import assert from 'assert'

import {Normalize, NormalizeOptions} from '../src/SMNormalize'

describe('SMNormalize', () => {

    it('Normalize: no options', () => {
        assert.equal(Normalize('ABC'), 'ABC')
        assert.equal(Normalize('èe'), 'ee')
        assert.equal(Normalize('€'), '€')
        assert.equal(Normalize('àòùìéëü'), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*'), 'aouieeu_-.*')
        assert.equal(Normalize('àòùìéëü_-.*\xA0'), 'aouieeu_-.* ') // Non-breaking space
        assert.equal(Normalize('Алушта'), 'Алушта')
        assert.equal(Normalize('Алушта=/\\"'), 'Алушта=/\\"')
        assert.equal(Normalize('把百'), '把百')
        assert.equal(Normalize('\uD804\uDC19'), '\uD804\uDC19') // SMP
        assert.equal(Normalize('\uD83D\uDE01'), '\uD83D\uDE01') // Emoji
        assert.equal(Normalize('\uD83D\uDE01'), '😁')
        assert.equal(Normalize('😁'), '😁')
    })

    it('Normalize: basic mode', () => {
        const options = {
            mode: 'basic'
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '€')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu_-.*')
        assert.equal(Normalize('àòùìéëü_-.*\xA0', options), 'aouieeu_-.* ') // Non-breaking space
        assert.equal(Normalize('Алушта', options), 'Алушта')
        assert.equal(Normalize('Алушта=/\\"', options), 'Алушта=/\\"')
        assert.equal(Normalize('把百', options), '把百')
        assert.equal(Normalize('\uD804\uDC19', options), '\uD804\uDC19') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '\uD83D\uDE01') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '😁')
        assert.equal(Normalize('😁', options), '😁')
    })

    it('Normalize: alphabetic mode', () => {
        const options = {
            mode: 'alphabetic'
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu_-.') // _-. are preserved by default
        assert.equal(Normalize('àòùìéëü_-.* ', options), 'aouieeu_-. ') // _-. are preserved by default
        assert.equal(Normalize('àòùìéëü_-.*\xA0', options), 'aouieeu_-. ') // Non-breaking space converted to normal space
        assert.equal(Normalize('Алушта', options), 'Алушта')
        assert.equal(Normalize('Алушта=/\\"', options), 'Алушта')
        assert.equal(Normalize('把百', options), '把百')
        assert.equal(Normalize('\uD804\uDC19', options), '\uD804\uDC19') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '')
        assert.equal(Normalize('😁', options), '')
    })

    it('Normalize: alphabetic mode, no preserveCharacters', () => {
        const options = {
            mode: 'alphabetic',
            preserveCharacters: ''
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.* ', options), 'aouieeu ') // spaces are preserved anyways
        assert.equal(Normalize('àòùìéëü_-.*\xA0', options), 'aouieeu ') // Non-breaking space converted to normal space
        assert.equal(Normalize('1230', options), '1230') // Numbers
        assert.equal(Normalize('\u0661', options), '\u0661') // Arabic-indic digit 1
        assert.equal(Normalize('\u1B54', options), '\u1B54') // Balinese digit 4
        assert.equal(Normalize('Алушта', options), 'Алушта')
        assert.equal(Normalize('Алушта=/\\"', options), 'Алушта')
        assert.equal(Normalize('把百', options), '把百')
        assert.equal(Normalize('\uD804\uDC19', options), '\uD804\uDC19') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '')
        assert.equal(Normalize('😁', options), '')
    })

    it('Normalize: alphabetic mode, custom preserveCharacters', () => {
        const options = {
            mode: 'alphabetic',
            preserveCharacters: '*'
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu*')
        assert.equal(Normalize('àòùìéëü_-.* ', options), 'aouieeu* ') // spaces are preserved anyways
        assert.equal(Normalize('àòùìéëü_-.*\xA0', options), 'aouieeu* ') // Non-breaking space converted to normal space
        assert.equal(Normalize('\u0661', options), '\u0661') // Arabic-indic digit 1
        assert.equal(Normalize('Алушта', options), 'Алушта')
        assert.equal(Normalize('Алушта=/\\"', options), 'Алушта')
        assert.equal(Normalize('把百', options), '把百')
        assert.equal(Normalize('\uD804\uDC19', options), '\uD804\uDC19') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '')
        assert.equal(Normalize('😁', options), '')
    })

    it('Normalize: alphabetic mode, keep emojis', () => {
        const options = {
            mode: 'alphabetic',
            keepEmojis: true
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu_-.*') // _-. are preserved by default. * is part of the emoji set
        assert.equal(Normalize('àòùìéëü_-.* ', options), 'aouieeu_-.* ') // _-. are preserved by default. * is part of the emoji set
        assert.equal(Normalize('àòùìéëü_-.*#\xA0', options), 'aouieeu_-.*# ') // Non-breaking space converted to normal space. * and # are part of the emoji set
        assert.equal(Normalize('1230', options), '1230') // Roman numerals are part of the emoji set
        assert.equal(Normalize('\u1B54', options), '\u1B54') // Balinese digit
        assert.equal(Normalize('Алушта', options), 'Алушта')
        assert.equal(Normalize('Алушта=/\\"', options), 'Алушта')
        assert.equal(Normalize('把百', options), '把百')
        assert.equal(Normalize('\uD804\uDC19', options), '\uD804\uDC19') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '\uD83D\uDE01') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '😁')
        assert.equal(Normalize('😁', options), '😁')
    })

    it('Normalize: alphabetic mode, remove numbers', () => {
        const options = {
            mode: 'alphabetic',
            removeNumbers: true
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu_-.') // _-. are preserved by default
        assert.equal(Normalize('àòùìéëü_-.* ', options), 'aouieeu_-. ') // _-. are preserved by default
        assert.equal(Normalize('àòùìéëü_-.*#\xA0', options), 'aouieeu_-. ') // Non-breaking space converted to normal space
        assert.equal(Normalize('1230', options), '') // Numbers
        assert.equal(Normalize('\u0661', options), '') // Arabic-indic digit 1
        assert.equal(Normalize('\u1B54', options), '') // Balinese digit 4
        assert.equal(Normalize('Алушта', options), 'Алушта')
        assert.equal(Normalize('Алушта=/\\"', options), 'Алушта')
        assert.equal(Normalize('把百', options), '把百')
        assert.equal(Normalize('\uD804\uDC19', options), '\uD804\uDC19') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '')
        assert.equal(Normalize('😁', options), '')
    })

    it('Normalize: alphabetic mode, remove numbers, keep emojis', () => {
        const options = {
            mode: 'alphabetic',
            keepEmojis: true,
            removeNumbers: true
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu_-.*') // _-. are preserved by default. * is part of the emoji set
        assert.equal(Normalize('àòùìéëü_-.* ', options), 'aouieeu_-.* ') // _-. are preserved by default. * is part of the emoji set
        assert.equal(Normalize('àòùìéëü_-.*#\xA0', options), 'aouieeu_-.*# ') // Non-breaking space converted to normal space. * and # are part of the emoji set
        assert.equal(Normalize('1230', options), '1230') // Roman numerals are part of the emoji set, so are kept regardless
        assert.equal(Normalize('\u0661', options), '') // Arabic-indic digit 1
        assert.equal(Normalize('\u1B54', options), '') // Balinese digit
        assert.equal(Normalize('Алушта', options), 'Алушта')
        assert.equal(Normalize('Алушта=/\\"', options), 'Алушта')
        assert.equal(Normalize('把百', options), '把百')
        assert.equal(Normalize('\uD804\uDC19', options), '\uD804\uDC19') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '\uD83D\uDE01') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '😁')
        assert.equal(Normalize('😁', options), '😁')
    })

    it('Normalize: latin mode', () => {
        const options = {
            mode: 'latin'
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu_-.') // _-. are preserved by default
        assert.equal(Normalize('àòùìéëü_-.* ', options), 'aouieeu_-. ') // _-. are preserved by default
        assert.equal(Normalize('àòùìéëü_-.*\xA0', options), 'aouieeu_-. ') // Non-breaking space converted to normal space
        assert.equal(Normalize('1230', options), '1230') // Numbers
        assert.equal(Normalize('\u0661', options), '') // Arabic-indic digit 1 - removed
        assert.equal(Normalize('\u1B54', options), '') // Balinese digit 4 - removed
        assert.equal(Normalize('Алушта', options), '')
        assert.equal(Normalize('Алушта=/\\"', options), '')
        assert.equal(Normalize('把百', options), '')
        assert.equal(Normalize('\uD804\uDC19', options), '') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '')
        assert.equal(Normalize('😁', options), '')
    })

    it('Normalize: latin mode, no preserveCharacters', () => {
        const options = {
            mode: 'latin',
            preserveCharacters: ''
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.* ', options), 'aouieeu ') // spaces are preserved anyways
        assert.equal(Normalize('àòùìéëü_-.*\xA0', options), 'aouieeu ') // Non-breaking space converted to normal space
        assert.equal(Normalize('1230', options), '1230') // Numbers
        assert.equal(Normalize('\u0661', options), '') // Arabic-indic digit 1 - removed
        assert.equal(Normalize('\u1B54', options), '') // Balinese digit 4 - removed
        assert.equal(Normalize('Алушта', options), '')
        assert.equal(Normalize('Алушта=/\\"', options), '')
        assert.equal(Normalize('把百', options), '')
        assert.equal(Normalize('\uD804\uDC19', options), '') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '')
        assert.equal(Normalize('😁', options), '')
    })

    it('Normalize: latin mode, custom preserveCharacters', () => {
        const options = {
            mode: 'latin',
            preserveCharacters: '*'
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu*')
        assert.equal(Normalize('àòùìéëü_-.* ', options), 'aouieeu* ') // spaces are preserved anyways
        assert.equal(Normalize('àòùìéëü_-.*\xA0', options), 'aouieeu* ') // Non-breaking space converted to normal space
        assert.equal(Normalize('\u0661', options), '') // Arabic-indic digit 1 - removed
        assert.equal(Normalize('\u1B54', options), '') // Balinese digit 4 - removed
        assert.equal(Normalize('Алушта', options), '')
        assert.equal(Normalize('Алушта=/\\"', options), '')
        assert.equal(Normalize('把百', options), '')
        assert.equal(Normalize('\uD804\uDC19', options), '') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '')
        assert.equal(Normalize('😁', options), '')
    })

    it('Normalize: latin mode, keep emojis', () => {
        const options = {
            mode: 'latin',
            keepEmojis: true
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu_-.*') // _-. are preserved by default. * is part of the emoji set
        assert.equal(Normalize('àòùìéëü_-.* ', options), 'aouieeu_-.* ') // _-. are preserved by default. * is part of the emoji set
        assert.equal(Normalize('àòùìéëü_-.*#\xA0', options), 'aouieeu_-.*# ') // Non-breaking space converted to normal space. * and # are part of the emoji set
        assert.equal(Normalize('1230', options), '1230') // Roman numerals are part of the emoji set
        assert.equal(Normalize('\u0661', options), '') // Arabic-indic digit 1 - removed
        assert.equal(Normalize('\u1B54', options), '') // Balinese digit 4 - removed
        assert.equal(Normalize('Алушта', options), '')
        assert.equal(Normalize('Алушта=/\\"', options), '')
        assert.equal(Normalize('把百', options), '')
        assert.equal(Normalize('\uD804\uDC19', options), '') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '\uD83D\uDE01') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '😁')
        assert.equal(Normalize('😁', options), '😁')
    })

    it('Normalize: latin mode, remove numbers', () => {
        const options = {
            mode: 'latin',
            removeNumbers: true
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu_-.') // _-. are preserved by default
        assert.equal(Normalize('àòùìéëü_-.* ', options), 'aouieeu_-. ') // _-. are preserved by default
        assert.equal(Normalize('àòùìéëü_-.*#\xA0', options), 'aouieeu_-. ') // Non-breaking space converted to normal space
        assert.equal(Normalize('1230', options), '') // Numbers
        assert.equal(Normalize('\u0661', options), '') // Arabic-indic digit 1
        assert.equal(Normalize('\u1B54', options), '') // Balinese digit 4
        assert.equal(Normalize('Алушта', options), '')
        assert.equal(Normalize('Алушта=/\\"', options), '')
        assert.equal(Normalize('把百', options), '')
        assert.equal(Normalize('\uD804\uDC19', options), '') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '')
        assert.equal(Normalize('😁', options), '')
    })

    it('Normalize: latin mode, remove numbers, keep emojis', () => {
        const options = {
            mode: 'latin',
            keepEmojis: true,
            removeNumbers: true
        } as NormalizeOptions

        assert.equal(Normalize('ABC', options), 'ABC')
        assert.equal(Normalize('èe', options), 'ee')
        assert.equal(Normalize('€', options), '')
        assert.equal(Normalize('àòùìéëü', options), 'aouieeu')
        assert.equal(Normalize('àòùìéëü_-.*', options), 'aouieeu_-.*') // _-. are preserved by default. * is part of the emoji set
        assert.equal(Normalize('àòùìéëü_-.* ', options), 'aouieeu_-.* ') // _-. are preserved by default. * is part of the emoji set
        assert.equal(Normalize('àòùìéëü_-.*#\xA0', options), 'aouieeu_-.*# ') // Non-breaking space converted to normal space. * and # are part of the emoji set
        assert.equal(Normalize('1230', options), '1230') // Roman numerals are part of the emoji set, so are kept regardless
        assert.equal(Normalize('\u0661', options), '') // Arabic-indic digit 1
        assert.equal(Normalize('\u1B54', options), '') // Balinese digit
        assert.equal(Normalize('Алушта', options), '')
        assert.equal(Normalize('Алушта=/\\"', options), '')
        assert.equal(Normalize('把百', options), '')
        assert.equal(Normalize('\uD804\uDC19', options), '') // SMP
        assert.equal(Normalize('\uD83D\uDE01', options), '\uD83D\uDE01') // Emoji
        assert.equal(Normalize('\uD83D\uDE01', options), '😁')
        assert.equal(Normalize('😁', options), '😁')
    })
})

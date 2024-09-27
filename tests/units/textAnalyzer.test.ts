import * as TextAnalyzer from '../../src/utils/textAnalyzer';

describe('TextAnalyzer', () => {
    describe('countWords', () => {
        it('should correctly count words in a string', () => {
            expect(TextAnalyzer.countWords('Hello world')).toBe(2);
            expect(TextAnalyzer.countWords('This is a test sentence')).toBe(5);
            expect(TextAnalyzer.countWords('')).toBe(0);
            expect(TextAnalyzer.countWords('   ')).toBe(0);
        });
    });

    describe('countCharacters', () => {
        it('should correctly count characters in a string', () => {
            expect(TextAnalyzer.countCharacters('Hello')).toBe(5);
            expect(TextAnalyzer.countCharacters('This is a test')).toBe(14);
            expect(TextAnalyzer.countCharacters('')).toBe(0);
            expect(TextAnalyzer.countCharacters(' ')).toBe(1);
        });
    });

    describe('countSentences', () => {
        it('should correctly count sentences in a string', () => {
            expect(TextAnalyzer.countSentences('This is a sentence. This is another one! And how about this one?')).toBe(3);
            expect(TextAnalyzer.countSentences('Hello world')).toBe(1);
            expect(TextAnalyzer.countSentences('One. Two. Three.')).toBe(3);
            expect(TextAnalyzer.countSentences('')).toBe(0);
            expect(TextAnalyzer.countSentences('  ')).toBe(0);
        });
    });

    describe('countParagraphs', () => {
        it('should correctly count paragraphs in a string', () => {
            expect(TextAnalyzer.countParagraphs('Paragraph 1.\n\nParagraph 2.')).toBe(2);
            expect(TextAnalyzer.countParagraphs('Single paragraph')).toBe(1);
            expect(TextAnalyzer.countParagraphs('P1\n\nP2\n\nP3')).toBe(3);
            expect(TextAnalyzer.countParagraphs('')).toBe(0);
            expect(TextAnalyzer.countParagraphs('  ')).toBe(0);
        });
    });

    describe('findLongestParagraphWords', () => {
        it('should correctly find the longest word in each paragraph', () => {
            const text = 'First paragraph with longword.\n\nSecond one.';
            expect(TextAnalyzer.findLongestParagraphWords(text)).toEqual(['paragraph', 'Second']);
            
            const singleParagraph = 'Single paragraph test';
            expect(TextAnalyzer.findLongestParagraphWords(singleParagraph)).toEqual(['paragraph']);
            
            const emptyText = '';
            expect(TextAnalyzer.findLongestParagraphWords(emptyText)).toEqual([]);

            const multipleParagraphs = 'First paragraph with longword.\n\nSecond one?\n\nThird one!';
            expect(TextAnalyzer.findLongestParagraphWords(multipleParagraphs)).toEqual(['paragraph', 'Second', 'Third']);
        });
    });
});

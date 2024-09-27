export const countWords = (text: string): number => {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    return words.length;
};

export const countCharacters = (text: string): number => {
    return text.length;
};

export const countSentences = (text: string): number => {
    const sentences = text.split(/[.!?]/).filter(sentence => sentence.trim().length > 0);
    return sentences.length;
};

export const countParagraphs = (text: string): number => {
    const paragraphs = text.split('\n\n').filter(paragraph => paragraph.trim().length > 0);
    return paragraphs.length;
};

export const findLongestParagraphWords = (text: string): string[] => {
    const paragraphs = text.split('\n\n').filter(paragraph => paragraph.trim().length > 0);
    return paragraphs.map(paragraph => {
        const words = paragraph.split(/\s+/).filter(word => word.length > 0);
        return words.sort((a, b) => b.length - a.length)[0];
    });
};


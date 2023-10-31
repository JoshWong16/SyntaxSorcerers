import pkg from 'natural';
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = pkg;
import SpellCorrector from "spelling-corrector";
import sw from "stopword";

const tokenizer = new WordTokenizer();
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

/* ChatGPT usage: No */
/* https://github.com/TomDoesTech/Sentiment-Analysis-NodeJS */
function getSentiment(text) {
    const tokenized = tokenizer.tokenize(text);
    const fixedSpelling = tokenized.map((word) => spellCorrector.correct(word));
    const stopWordsRemoved = sw.removeStopwords(fixedSpelling);
    const analyzed = analyzer.getSentiment(stopWordsRemoved);

    return analyzeSentimentScore(analyzed);
}

/* ChatGPT usage: No */
function analyzeSentimentScore(score) { 
   if (score > 0) {
       return "positive";
   } else if (score < 0) {
       return "negative";
   } else {
        return "neutral";
   }
}

export { getSentiment, analyzeSentimentScore };
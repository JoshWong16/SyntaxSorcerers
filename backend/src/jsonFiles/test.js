import natural from 'natural';
import coursesData from './courses.json' assert { type: 'json' };

const courses = coursesData.courses; // Access the 'courses' property

// Tokenize and stem the keywords for matching
function processKeywords(keyword) {
    const tokenizer = new natural.WordTokenizer();
    const stemmedKeywords = natural.PorterStemmer.tokenizeAndStem(keyword);
    return stemmedKeywords;
}

function searchCourses(keyword) {
    const processedKeywords = processKeywords(keyword);

    const matchingCourses = courses.filter(course => {
        const courseKeywords = processKeywords(course); // Using 'course' directly as it's a string
        return courseKeywords.some(keyword => processedKeywords.includes(keyword));
    });

    return matchingCourses;
}

// Example usage
const userInput = 'machine learning';
const matchingCourses = searchCourses(userInput);
console.log(matchingCourses);

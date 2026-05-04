import { GoogleGenerativeAI } from '@google/generative-ai';

// Validate API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in .env file');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get AI summary of text content using Gemini
 * @param {string} text - Text content to summarize
 * @param {string} type - Type of summary: 'summary', 'keypoints', 'flashcards'
 * @returns {Promise<string>} - AI generated content
 */
export const getAISummary = async (text, type = 'summary') => {
  try {
    console.log('Generating AI summary, type:', type);
    console.log('Text length:', text.length);
    
    // Use gemini-1.5-flash which is more reliable
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';
    
    switch (type) {
      case 'summary':
        prompt = `Please provide a comprehensive summary of the following educational notes. 
        Organize it in a clear, chapter-wise format with main topics and key concepts explained.
        Make it easy to understand for students.
        
        Notes Content:
        ${text}
        
        Format the response with clear headings and bullet points.`;
        break;
        
      case 'keypoints':
        prompt = `Extract the most important key points from the following educational notes.
        List them in order of importance with brief explanations.
        Focus on concepts, formulas, definitions, and exam-important topics.
        
        Notes Content:
        ${text}
        
        Format as a numbered list with clear explanations.`;
        break;
        
      case 'flashcards':
        prompt = `Create study flashcards from the following educational notes.
        For each important concept, create a question-answer pair.
        Include at least 10-15 flashcards covering the main topics.
        
        Notes Content:
        ${text}
        
        Format as:
        Q1: [Question]
        A1: [Answer]
        
        Q2: [Question]
        A2: [Answer]
        
        And so on...`;
        break;
        
      default:
        prompt = `Please summarize the following content:
        ${text}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();
    
    console.log('AI summary generated successfully, length:', aiText.length);
    return aiText;
  } catch (error) {
    console.error('Error getting AI summary:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw new Error(`Failed to generate AI summary: ${error.message}`);
  }
};

/**
 * Ask AI a question about the notes content
 * @param {string} text - Notes content for context
 * @param {string} question - User's question
 * @returns {Promise<string>} - AI generated answer
 */
export const askAIQuestion = async (text, question) => {
  try {
    console.log('Asking AI question:', question);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Based on the following educational notes, please answer this question:
    
    Question: ${question}
    
    Notes Content for Context:
    ${text}
    
    Provide a clear, detailed, and educational answer.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error asking AI question:', error);
    throw new Error('Failed to get AI response');
  }
};

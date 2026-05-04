import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/**
 * Extract text content from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error('PDF file not found');
    }

    // Read the PDF file
    const dataBuffer = fs.readFileSync(filePath);
    
    // Parse PDF using CommonJS require
    const data = await pdfParse(dataBuffer);
    
    // Return extracted text
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from PDF with size limit (to avoid token limits)
 * @param {string} filePath - Path to the PDF file
 * @param {number} maxChars - Maximum characters to extract (default: 50000)
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromPDFLimited = async (filePath, maxChars = 50000) => {
  const fullText = await extractTextFromPDF(filePath);
  
  // If text is within limit, return as is
  if (fullText.length <= maxChars) {
    return fullText;
  }
  
  // Otherwise, truncate and add note
  return fullText.substring(0, maxChars) + '\n\n[Note: Content truncated due to size limits]';
};

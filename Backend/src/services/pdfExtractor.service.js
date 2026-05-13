import fs from 'fs';
import { createRequire } from 'module';
import https from 'https';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

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
 * Extract text content from a PDF buffer (for Cloudinary files)
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromPDFBuffer = async (buffer) => {
  try {
    // Parse PDF using CommonJS require
    const data = await pdfParse(buffer);
    
    // Return extracted text
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF buffer:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Download file from URL and return buffer
 * @param {string} url - URL to download from
 * @returns {Promise<Buffer>} - File buffer
 */
export const downloadFileFromUrl = async (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
};

/**
 * Extract text from file URL (supports both Cloudinary and local files)
 * @param {string} fileUrl - URL or path of the file
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromFileUrl = async (fileUrl) => {
  try {
    // Check if it's a local file path or URL
    if (fileUrl.startsWith('/uploads/')) {
      // Local file
      const filename = fileUrl.split('/').pop();
      const filepath = path.join(uploadsDir, filename);
      
      if (!fs.existsSync(filepath)) {
        throw new Error(`Local file not found: ${filepath}`);
      }
      
      return await extractTextFromPDF(filepath);
    } else {
      // Remote URL (Cloudinary or other)
      const buffer = await downloadFileFromUrl(fileUrl);
      return await extractTextFromPDFBuffer(buffer);
    }
  } catch (error) {
    console.error('Error extracting text from file URL:', error);
    throw error;
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

/**
 * Extract text from PDF URL with size limit
 * @param {string} url - URL of the PDF file
 * @param {number} maxChars - Maximum characters to extract (default: 50000)
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromPDFUrlLimited = async (url, maxChars = 50000) => {
  const fullText = await extractTextFromFileUrl(url);
  
  // If text is within limit, return as is
  if (fullText.length <= maxChars) {
    return fullText;
  }
  
  // Otherwise, truncate and add note
  return fullText.substring(0, maxChars) + '\n\n[Note: Content truncated due to size limits]';
};

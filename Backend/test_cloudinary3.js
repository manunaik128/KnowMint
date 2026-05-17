
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

console.log("\n=== Cloudinary Credential Check ===");
console.log("CLOUDINARY_CLOUD_NAME :", process.env.CLOUDINARY_CLOUD_NAME  || "❌ MISSING");
console.log("CLOUDINARY_API_KEY    :", process.env.CLOUDINARY_API_KEY     || "❌ MISSING");
console.log("CLOUDINARY_API_SECRET :", process.env.CLOUDINARY_API_SECRET  ? "✅ set (hidden)" : "❌ MISSING");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

// Test 1: Ping Cloudinary API
console.log("\n[Test 1] Pinging Cloudinary API...");
try {
  const result = await cloudinary.api.ping();
  console.log("✅ API ping success:", result);
} catch (err) {
  console.error("❌ API ping failed:", err.message, "| http_code:", err.http_code);
  if (err.http_code === 401 || err.http_code === 403) {
    console.error("   → Your API key or secret is WRONG. Copy them fresh from Cloudinary dashboard.");
  }
  process.exit(1);
}

// Test 2: Upload a tiny test file
console.log("\n[Test 2] Uploading a tiny test text file as 'raw'...");
const testBuffer = Buffer.from("Hello Cloudinary - test upload");

const uploadResult = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: 'knowmint/test',
      resource_type: 'raw',
      public_id: `test-${Date.now()}`,
      timeout: 60000,
    },
    (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }
  );
  stream.end(testBuffer);
});

console.log("✅ Upload success!");
console.log("   URL:", uploadResult.secure_url);
console.log("   Public ID:", uploadResult.public_id);

// Clean up test file
await cloudinary.uploader.destroy(uploadResult.public_id, { resource_type: 'raw' });
console.log("✅ Test file cleaned up.");
console.log("\n=== All tests passed! Your Cloudinary config is correct. ===\n");
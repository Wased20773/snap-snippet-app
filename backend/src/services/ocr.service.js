import { Buffer } from "buffer";
import sharp from "sharp";
import Tesseract from "tesseract.js";

// Desired visual x-height range for Tesseract (px)
const TARGET_CHAR_HEIGHT = 26;

// Aggressive downscale only — avoid upscaling close-ups
const MIN_SCALE = 0.35;
const MAX_SCALE = 1.0;

// Reject obviously broken OCR
// const MIN_TEXT_CONFIDENCE = 60;

export async function extractedCodeFromImage(imageBase64) {
  // 1. Clean base64
  const cleanedBase64 = imageBase64.includes("base64,")
    ? imageBase64.split("base64,")[1]
    : imageBase64;

  const buffer = Buffer.from(cleanedBase64, "base64");

  // 2. Estimate character scale WITHOUT OCR (important)
  const metadata = await sharp(buffer).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("Invalid image metadata");
  }

  // Heuristic: assume code text occupies ~1/20 height
  const estimatedCharHeight = metadata.height / 20;
  let scaleFactor = TARGET_CHAR_HEIGHT / estimatedCharHeight;

  // Clamp aggressively (downscale preferred)
  scaleFactor = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scaleFactor));

  const targetWidth = Math.round(metadata.width * scaleFactor);

  // 3. Image preprocessing (NO hard thresholding)
  const processedImage = await sharp(buffer)
    .resize({
      width: targetWidth,
      withoutEnlargement: true, // critical
    })
    .grayscale()
    .linear(1.1, -10) // gentle contrast
    .blur(0.3) // reconnect strokes
    .sharpen()
    .toBuffer();

  // 4. OCR pass (LSTM only, sparse text)
  const result = await Tesseract.recognize(processedImage, "eng", {
    psm: 11, // Sparse text — best for code
    tessedit_ocr_engine_mode: 1, // LSTM only
    preserve_interword_spaces: true,
    tessedit_char_whitelist:
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_[](){}:,.\"'<>+-=*/ \n\t",
    tessjs_create_pdf: "0",
  });

  const text = result.data.text ?? "";
  // const confidence = result.data.confidence ?? 0;

  // 5. Bail early if OCR is clearly broken
  // if (confidence < MIN_TEXT_CONFIDENCE || looksLikeGarbage(text)) {
  //   throw new Error("Tesseract OCR confidence too low");
  // }

  // 6. Cleanup
  return text
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n");
}

/**
 * Heuristic garbage detection
 */
// function looksLikeGarbage(text) {
//   if (!text.trim()) return true;

//   const junkRatio =
//     (text.match(/[^a-zA-Z0-9\s_()[\]{}<>:+\-*/=.,'"`]/g)?.length || 0) /
//     text.length;

//   // Too many weird symbols → OCR likely failed
//   return junkRatio > 0.15;
// }

/**
 * Repair indentation heuristically (language-agnostic)
 */
export function repairIndentation(code) {
  const lines = code.split("\n");
  let indentLevel = 0;

  return lines
    .map((line) => {
      const trimmed = line.trim();
      // Empty line
      if (trimmed === "") return "";

      // Beginning block scope
      if (trimmed.endsWith(":") || trimmed.endsWith("{")) {
        const result = " ".repeat(indentLevel * 2) + trimmed;
        indentLevel++;
        return result;
      }
      // Ending block scope
      else if (trimmed.endsWith("}")) {
        indentLevel--;
      }

      return " ".repeat(indentLevel * 2) + trimmed;
    })
    .join("\n");
}

/**
 * Normalize common OCR junk characters
 */
export function normalizeCharacters(code) {
  return (
    code
      // Quotes
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[`´]/g, "'")
      // Trademark garbage
      .replace(/[™®]/g, '"')
      // Whitespace
      .replace(/\u00A0/g, " ")
      // Comparators / equality
      .replace(/»/g, "=")
      .replace(/«/g, "<")
      // Remove vertical bar junk
      .replace(/[|]/g, "")
  );
}

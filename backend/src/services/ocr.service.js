import Tesseract from "tesseract.js";

export async function extractedCodeFromImage(imageBase64) {
  const result = await Tesseract.recognize(
    Buffer.from(imageBase64, "base64"),
    "eng",
    {
      preserve_interword_spaces: true, // helps preserve indentation
      tessjs_create_pdf: "0",
    }
  );

  return result.data.text
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n");
}

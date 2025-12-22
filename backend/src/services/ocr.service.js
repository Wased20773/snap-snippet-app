import Tesseract from "tesseract.js";

export async function extractedCodeFromImage(imageBase64) {
  const cleanedBase64 = imageBase64.includes("base64,")
    ? imageBase64.split("base64,")[1]
    : imageBase64;

  const buffer = Buffer.from(cleanedBase64, "base64");
  const result = await Tesseract.recognize(buffer, "eng", {
    preserve_interword_spaces: true, // helps preserve indentation
    tessedit_char_whitelist:
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_[](){}:,.\"'<>+-=*/ \n\t",
    tessjs_create_pdf: "0",
  });
  return result.data.text
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n");
}

export function repairIndentation(code) {
  const lines = code.split("\n");
  let indentLevel = 0;

  return lines
    .map((line) => {
      const trimmed = line.trim();

      if (trimmed === "") return "";

      if (trimmed.endsWith(":") || trimmed.endsWith("{")) {
        const result = " ".repeat(indentLevel * 2) + trimmed;
        indentLevel++;
        return result;
      } else if (trimmed.endsWith("}")) {
        indentLevel--;
      }

      return " ".repeat(indentLevel * 2) + trimmed;
    })
    .join("\n");
}

import { validateCodeSyntax } from "../services/ai.service.js";
import { extractedCodeFromImage } from "../services/ocr.service.js";
import { runCodeInSandbox } from "../services/sandbox.service.js";

export async function scanCode(req, res) {
  try {
    const { image, language } = req.body; // image: base64 string

    // 1. Extract code from image using OCR
    const extractedCode = await extractedCodeFromImage(image);

    // 2. Validate syntax with AI
    const syntaxResult = await validateCodeSyntax(extractedCode, language);

    if (!syntaxResult.valid) {
      return res.status(200).json({
        // 3a. Send syntax errors + suggestions back
        code: extractedCode,
        error: syntaxResult.error,
        suggestions: syntaxResult.suggestions,
      });
    }

    // 3b. Run code in sandbox
    const sandboxResult = await runCodeInSandbox(extractedCode, language);

    let response = {
      code: extractedCode,
      output: sandboxResult.output,
      error: sandboxResult.error || null,
    };

    res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Error scanning code", error: e.message });
  }
}

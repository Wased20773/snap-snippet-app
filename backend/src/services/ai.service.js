export async function validateCodeSyntax(code, language) {
  // No ai, temporary mock... assume syntax is valid
  return {
    valid: true,
    error: null,
    suggestions: ["none"],
  };
}

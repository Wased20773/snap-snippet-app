import { exec } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";

const TEMP_DIR = os.tmpdir();

export async function runCodeInSandbox(code, language) {
  // Map language to Docker image and command
  const languageConfig = {
    python: { image: "python:3.12-alpine", cmd: "python" },
    javascript: { image: "node:20-alpine", cmd: "node" },
    cpp: { image: "gcc:12", cmd: "g++" },
  };

  const config = languageConfig[language.toLowerCase()];
  if (!config) {
    return { output: null, error: "Unsupported language" };
  }

  // Create temporary file
  const ext =
    language === "cpp" ? "cpp" : language === "javascript" ? "js" : "py";
  const tempFilePath = path.join(TEMP_DIR, `sandbox_${Date.now()}.${ext}`);
  await fs.writeFile(tempFilePath, code);

  try {
    let cmd = "";
    if (language === "cpp") {
      const exePath = tempFilePath.replace(".cpp", ".out");
      cmd = `docker run --rm -v ${TEMP_DIR}:/sandbox ${
        config.image
      } sh -c "g++ /sandbox/${path.basename(
        tempFilePath
      )} -o /sandbox/${path.basename(exePath)} && /sandbox/${path.basename(
        exePath
      )}"`;
    } else {
      cmd = `docker run --rm -v ${TEMP_DIR}:/sandbox ${config.image} ${
        config.cmd
      } /sandbox/${path.basename(tempFilePath)}`;
    }

    const output = await new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error)
          return resolve({ output: stdout, error: stderr || error.message });
        resolve({ output: stdout, error: stderr || null });
      });
    });

    return output;
  } finally {
    await fs.unlink(tempFilePath); // cleanup
  }
}

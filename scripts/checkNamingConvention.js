const fs = require("fs");
const path = require("path");

const IGNORED_DIRS = ["node_modules", ".git", "dist", "build"];

function isPascalCase(name) {
    return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

function isCamelCase(name) {
    return /^[a-z][A-Za-z0-9]*$/.test(name);
}

function checkDir(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            if (!IGNORED_DIRS.includes(entry.name)) {
                checkDir(fullPath);
            }
        } else {
            const ext = path.extname(entry.name);
            const baseName = path.basename(entry.name, ext);

            if (ext === ".tsx" && !isPascalCase(baseName)) {
                console.error(`❌ Invalid PascalCase: ${fullPath}`);
                process.exitCode = 1;
            } else if (ext === ".ts" && !entry.name.endsWith(".d.ts") && !isCamelCase(baseName)) {
                console.error(`❌ Invalid camelCase: ${fullPath}`);
                process.exitCode = 1;
            }
        }
    }
}

checkDir(".");

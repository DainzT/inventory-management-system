import "@testing-library/jest-dom";
const { TextEncoder, TextDecoder } = require("text-encoding");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
Object.defineProperty(global, "import.meta", {
  value: {
    env: {
      VITE_API_URL: "http://localhost:3000",
    },
  },
});

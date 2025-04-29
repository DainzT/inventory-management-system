import "@testing-library/jest-dom";
const { TextEncoder, TextDecoder } = require("text-encoding");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

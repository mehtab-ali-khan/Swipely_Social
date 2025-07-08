// src/store/openapi-config.ts
const config = {
  schemaFile: "http://localhost:8000/schema.json",
  apiFile: "./src/services/emptyApi.ts",
  apiImport: "emptyApi",
  outputFile: "./src/store/generatedApi.ts",
  exportName: "generatedApi",
  hooks: true,
};

export default config;

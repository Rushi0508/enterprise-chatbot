import { AzureOpenAI } from "openai";

export const openai = new AzureOpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION,
});

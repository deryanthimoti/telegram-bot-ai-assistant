import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';

export async function getCoinInsightAndSafetyScore(data: any) {
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are an expert in analyzing Cryptocurrency coins based on market data from https://dexscreener.com/.'],
    ['human', '{input}'],
  ]);

  const chain = RunnableSequence.from([prompt, model]);

  // 4. Call the chain with user input
  const response = await chain.invoke({ input: `Give insight about this coin and analyze the safety score (0-100) based on this data:
${data} in this format:
insight: string;
score: number;
`});

  console.log('Response:', response.content);
  return response.content;
}

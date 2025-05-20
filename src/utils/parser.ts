import type { MessageType } from "../types";

export function getMessageType(text: string): MessageType | null {
  switch(true){
    case /(?:What's the price of|What's the current price of|Check for) \$(.+)\?/i.test(text):
      return 'PROMPT';
    case /\/(\w+)/.test(text):
      return 'COMMAND';
    default:
      return null;
  }
};

export function parseCommand(text: string): string {
  const regex = /\/(\w+)/;
  const match = text.match(regex);

  if (match) return match?.[1];
  else return '';
};

export function parseCoinPrompt(text: string): { coinId: string } | null {
  const regex = /(?:What's the price of|What's the current price of|Check for) \$(.+)\?/i;
  const match = text.match(regex);

  if (match) {
    const [, coinId] = match;
    return {
      coinId,
    };
  }

  return null;
};

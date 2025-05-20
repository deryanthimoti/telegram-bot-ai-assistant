import type { MessageType } from "../types";

export function getMessageType(text: string): MessageType | null {
  switch(true){
    case /(?:What's the price of|What's the current price of|Check for) \$(.+)\?/i.test(text):
      return 'PROMPT';
    case /\/(\w+)/.test(text):
      return 'COMMAND';
    case /([A-Z0-9])\w+/.test(text):
      return 'ADDRESS';
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

export function parseAddress(text: string): string {
  const regex = /([A-Z0-9])\w+/;
  const match = text.match(regex);

  if (match) return match?.[0];
  else return '';
};

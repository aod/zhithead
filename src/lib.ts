export type Card = number;

export enum Suite {
  Clubs,
  Diamonds,
  Hearts,
  Spades,
}

export enum Rank {
  Ace,
  Num2,
  Num3,
  Num4,
  Num5,
  Num6,
  Num7,
  Num8,
  Num9,
  Num10,
  Jack,
  Queen,
  King,
}

export const SUITE_BIN_WIDTH = 2;

export function createCard(suite: Suite, rank: Rank): Card {
  return (rank << SUITE_BIN_WIDTH) | suite;
}

function _1s(n: number): number {
  return (1 << n) - 1;
}

export function getSuite(card: Card): Suite {
  return card & _1s(SUITE_BIN_WIDTH);
}

export const RANK_BIN_WIDTH = 4;

export function getRank(card: Card): Rank {
  return (card >> SUITE_BIN_WIDTH) & _1s(RANK_BIN_WIDTH);
}

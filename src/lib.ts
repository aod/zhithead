export enum Suite {
  Spades,
  Diamonds,
  Clubs,
  Hearts,
}

export enum Rank {
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
  Ace,
}

export type Card = number;
export const SUITE_BIN_WIDTH = 2;

export function createCard(suite: Readonly<Suite>, rank: Readonly<Rank>): Card {
  return (rank << SUITE_BIN_WIDTH) | suite;
}

function _1s(n: number): number {
  return (1 << n) - 1;
}

export function getSuite(card: Readonly<Card>): Suite {
  return card & _1s(SUITE_BIN_WIDTH);
}

export const RANK_BIN_WIDTH = 4;

export function getRank(card: Readonly<Card>): Rank {
  return (card >> SUITE_BIN_WIDTH) & _1s(RANK_BIN_WIDTH);
}

function createRanks(): Rank[] {
  return [
    Rank.Ace,
    Rank.Num2,
    Rank.Num3,
    Rank.Num4,
    Rank.Num5,
    Rank.Num6,
    Rank.Num7,
    Rank.Num8,
    Rank.Num9,
    Rank.Num10,
    Rank.Jack,
    Rank.Queen,
    Rank.King,
  ];
}

function createSuites(): Suite[] {
  return [Suite.Clubs, Suite.Diamonds, Suite.Hearts, Suite.Spades];
}

export type Cards = Card[];
export type Deck = Cards;
export type Pile = Cards;

export function createDeck(): Deck {
  return createSuites().flatMap((suite) =>
    createRanks().map((rank) => createCard(suite, rank))
  );
}

export interface Player {
  hand: Cards;
  offHand: {
    faceDown: Cards;
    faceUp: Cards;
  };
}

export function makePlayer(): Player {
  return {
    hand: [],
    offHand: {
      faceDown: [],
      faceUp: [],
    },
  };
}

const STARTING_HAND_SIZE = 6;
const STARTING_FACEDOWN_SIZE = 3;

export function dealCards(deck: Readonly<Deck>): [Deck, Player] {
  const deckCopy = deck.slice();
  const player = makePlayer();
  player.hand = deckCopy.splice(-STARTING_HAND_SIZE);
  player.offHand.faceDown = deckCopy.splice(-STARTING_FACEDOWN_SIZE);
  return [deckCopy, player];
}

export function dealCardsFor(
  playerCount: number,
  deck: Readonly<Deck>
): [Deck, Player[]] {
  let newDeck = deck.slice();
  const players = [];
  for (let i = 0; i < playerCount; i++) {
    let player;
    [newDeck, player] = dealCards(newDeck);
    players.push(player);
  }
  return [newDeck!, players];
}

export function canPlay(card: Readonly<Card>, pile: Readonly<Pile>): boolean {
  const top = pile.at(-1);
  if (!top) return true;
  if (getRank(top) === Rank.Num8) return canPlay(card, pile.slice(0, -1));
  if ([Rank.Num2, Rank.Num8].includes(getRank(card))) return true;
  if (getRank(top) === Rank.Num7) return getRank(card) < getRank(top);
  return getRank(card) >= getRank(top);
}

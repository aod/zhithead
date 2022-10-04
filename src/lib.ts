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

export function cardToString(card: Readonly<Card>) {
  return `${Suite[getSuite(card)]}-${[Rank[getRank(card)]]}`;
}

export function compareCards(a: Readonly<Card>, b: Readonly<Card>) {
  return getRank(a) - getRank(b);
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

export function isPileBurnable(pile: Readonly<Pile>): boolean {
  const topCard = pile.at(-1);
  if (topCard === undefined) return false;
  const isTopCard10 = getRank(topCard) === Rank.Num10;
  const areTop4CardsSameRank =
    pile.length >= 4 &&
    pile.slice(-4).every((card) => getRank(card) === getRank(topCard));
  return isTopCard10 || areTop4CardsSameRank;
}

export type OffHandCards = [Card?, Card?, Card?];

export function asCards(
  cards: Readonly<OffHandCards> | Readonly<Cards>
): Cards {
  return cards.filter((card) => card !== undefined) as Cards;
}

export interface Player {
  hand: Cards;
  offHand: {
    faceDown: OffHandCards;
    faceUp: OffHandCards;
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

export function totalCards(player: Player) {
  return HandKinds.map((handKind) => playerHandLen(player, handKind)).reduce(
    (sum, len) => sum + len,
    0
  );
}

export const HandKinds = ["hand", "faceUp", "faceDown"] as const;
type HandKind = typeof HandKinds[number];

export function offHandLen(cards: OffHandCards) {
  return cards.filter((card) => card !== undefined).length;
}

export function playerHandLen(player: Player, kind: HandKind) {
  switch (kind) {
    case "hand":
      return player.hand.length;
    case "faceDown":
    case "faceUp":
      return offHandLen(player.offHand[kind]);
  }
}

function playerCurHand(player: Player): HandKind | undefined {
  return HandKinds.find((kind) => playerHandLen(player, kind) > 0);
}

export function isPlayerCurHand(player: Player, ...kinds: HandKind[]) {
  return kinds.some((kind) => playerCurHand(player) === kind);
}

const STARTING_HAND_SIZE = 6;
const STARTING_FACEDOWN_SIZE = 3;

export function dealCards(deck: Readonly<Deck>): [Deck, Player] {
  const deckCopy = deck.slice();
  const player = makePlayer();
  player.hand = deckCopy.splice(-STARTING_HAND_SIZE);
  player.offHand.faceDown = deckCopy.splice(
    -STARTING_FACEDOWN_SIZE
  ) as OffHandCards;
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

function topCard(pile: Readonly<Pile>): Card | undefined {
  const top = pile.at(-1);
  if (top === undefined) return;
  if (getRank(top) === Rank.Num8) return topCard(pile.slice(0, -1));
  return top;
}

export function canPlay(card: Readonly<Card>, pile: Readonly<Pile>): boolean {
  if ([Rank.Num2, Rank.Num8].includes(getRank(card))) return true;
  const top = topCard(pile);
  if (top === undefined) return true;
  if (getRank(top) === Rank.Num7) return getRank(card) <= getRank(top);
  return getRank(card) >= getRank(top);
}

export function playableCards(pile: Readonly<Pile>): Rank[] {
  return createDeck().filter((card) => canPlay(card, pile));
}

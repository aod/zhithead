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

export function displayCard(card: Card) {
  const rank = getRank(card);
  const rankDisplay = rank <= Rank.Num10 ? rank + 2 : Rank[rank].at(0);
  const suiteDisplay = Suite[getSuite(card)].at(0);
  return `${rankDisplay}${suiteDisplay}`;
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

function displayPlayer(player: Readonly<Player>): string {
  return `Player(${[
    player.hand.map(displayCard).join("|"),
    asCards(player.offHand.faceDown).map(displayCard).join("|"),
    asCards(player.offHand.faceUp).map(displayCard).join("|"),
  ].join(":")})`;
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

export function isPlayerCurrentHand(player: Player, ...kinds: HandKind[]) {
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

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export type Zhithead = {
  deck: Deck;
  pile: Pile;
  turn: number;
  players: Player[];
};

export function displayZhithead(zhithead: Readonly<Zhithead>): string {
  return [
    `Deck(${zhithead.deck.map(displayCard).join("")})`,
    `Pile(${zhithead.pile.map(displayCard).join("")})`,
    `Turn(${zhithead.turn})`,
    `Players(${zhithead.players.map(displayPlayer).join(",")})`,
  ].join(":");
}

export function decodeZhithead(from: string): Zhithead {
  const [encodedDeck, encodedPile, turn, ...encodedPlayers] = from.split(":");
  const players = [
    encodedPlayers.slice(0, 3),
    encodedPlayers.slice(3, 6),
    encodedPlayers.slice(6, 9),
    encodedPlayers.slice(9, 12),
  ]
    .filter((it) => it.length > 0)
    .map(decodePlayer);
  return {
    deck: encodedDeck.split("").map(decodeCard),
    pile: encodedPile.split("").map(decodeCard),
    turn: Number(turn),
    players,
  };
}

export type EncodedZhithead = string;

export function encodeZhithead(zhithead: Readonly<Zhithead>): EncodedZhithead {
  return [
    zhithead.deck.map(encodeCard).join(""),
    zhithead.pile.map(encodeCard).join(""),
    zhithead.turn,
    ...zhithead.players.map((player) =>
      [
        player.hand.map(encodeCard).join(""),
        asCards(player.offHand.faceDown).map(encodeCard).join(""),
        asCards(player.offHand.faceUp).map(encodeCard).join(""),
      ].join(":")
    ),
  ].join(":");
}

export function decodeCard(from: string): Card {
  const code = from.charCodeAt(0);
  const card = code <= 90 ? code - 65 : 26 + code - 97;
  return card as Card;
}

export function encodeCard(to: Card): string {
  return to >= 26
    ? String.fromCharCode(to - 26 + 97)
    : String.fromCharCode(to + 65);
}

function decodePlayer(player: string[]): Player {
  return {
    hand: player[0].split("").map(decodeCard),
    offHand: {
      faceDown: player[1].split("").map(decodeCard) as OffHandCards,
      faceUp: player[2].split("").map(decodeCard) as OffHandCards,
    },
  };
}

import produce from "immer";
import { shuffle } from "./util";

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

export function createDeck(): Card[] {
  return createSuites().flatMap((suite) =>
    createRanks().map((rank) => createCard(suite, rank))
  );
}

export interface Player {
  hand: Card[];
  offHand: {
    faceDown: Card[];
    faceUp: Card[];
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

export enum StateKind {
  ChoosingOffHandFaceUpCards,
  Playing,
  Ended,
}

export type State =
  | { kind: StateKind.ChoosingOffHandFaceUpCards }
  | { kind: StateKind.Playing }
  | { kind: StateKind.Ended };

export interface Game {
  deck: Card[];
  me: Player;
  ai: Player;
  state: State;
}

export function setState(game: Game, state: State): Game {
  return produce(game, (draft) => {
    draft.state = state;
  });
}

export function createGame(): Game {
  return {
    deck: shuffle(createDeck()),
    ai: makePlayer(),
    me: makePlayer(),
    state: { kind: StateKind.ChoosingOffHandFaceUpCards },
  };
}

type FromPlayers = "ai" | "me";
const OFFHAND_CARDS_SIZE = 3;
const INITIAL_HAND_CARDS_SIZE = 6;

function dealCardsToPlayer(game: Game, player: FromPlayers) {
  return produce(game, (draft) => {
    draft[player].hand = draft.deck.splice(-INITIAL_HAND_CARDS_SIZE);
    draft[player].offHand.faceDown = draft.deck.splice(-OFFHAND_CARDS_SIZE);
    return draft;
  });
}

export function dealCards(game: Game): Game {
  return dealCardsToPlayer(dealCardsToPlayer(game, "me"), "ai");
}

export function hasChoosenAllFaceUpCards(game: Game): boolean {
  return (
    game.state.kind >= StateKind.Playing ||
    game["me"].offHand.faceUp.length === OFFHAND_CARDS_SIZE
  );
}

export function playCard(game: Game, handCardIndex: number): Game {
  return produce(game, (draft) => {
    const card = draft.me.hand[handCardIndex];
    switch (game.state.kind) {
      case StateKind.ChoosingOffHandFaceUpCards:
        draft.me.offHand.faceUp.push(card);
        draft.me.hand.splice(handCardIndex, 1);
        if (hasChoosenAllFaceUpCards(draft)) {
          draft.state = { kind: StateKind.Playing };
        }
        break;
    }
    return draft;
  });
}

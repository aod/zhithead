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

export function dealCards(game: Game): Game {
  return produce(game, (draft) => {
    if (draft.state.kind === StateKind.ChoosingOffHandFaceUpCards) {
      draft.me = {
        hand: draft.deck.splice(-6),
        offHand: {
          faceDown: draft.deck.splice(-3),
          faceUp: [],
        },
      };
      draft.ai = {
        hand: draft.deck.splice(-6),
        offHand: {
          faceDown: draft.deck.splice(-3),
          faceUp: [],
        },
      };
    }
  });
}

export function playCard(
  game: Game,
  handCardIndex: number,
  offHandFaceUpIndex: number
): Game {
  return produce(game, (draft) => {
    const handCard = draft.me.hand[handCardIndex];
    const offHandFaceUpCard = draft.me.offHand.faceUp.at(offHandFaceUpIndex);

    switch (game.state.kind) {
      case StateKind.ChoosingOffHandFaceUpCards:
        if (offHandFaceUpCard === undefined) {
          draft.me.offHand.faceUp[offHandFaceUpIndex] = handCard;
          draft.me.hand.splice(handCardIndex, 1);
        } else {
          draft.me.hand[handCardIndex] = offHandFaceUpCard;
          draft.me.offHand.faceUp[offHandFaceUpIndex] = handCard;
        }
        break;
    }
    return draft;
  });
}

import { assign } from "@xstate/immer";
import { ContextFrom } from "xstate";
import { createModel } from "xstate/lib/model";
import { Card, createDeck, dealCardsFor, Player } from "./lib";

type ShownHand = "hand" | "offhand";

interface ZhitheadContext {
  deck: Card[];
  pile: Card[];
  human: Player;
  bot: Player;
  shownHand: ShownHand;
}

function createInitialContext(): ZhitheadContext {
  const shuffledDeck = shuffle(createDeck());
  const [deck, [human, bot]] = dealCardsFor(2, shuffledDeck);

  return {
    deck,
    pile: [],
    human,
    bot,
    shownHand: "hand",
  };
}

const zhitheadModel = createModel(createInitialContext(), {
  events: {
    PLAY_CARD: (index: number) => ({ index }),
    SET_SHOWN_HAND: (shownHand: ShownHand) => ({ shownHand }),
    TAKE_CARD: () => ({}),
  },
});

export enum States {
  choosingFaceUpCards = "choosingFaceUpCards",
  playing = "playing",
}

export const zhitheadMachine = zhitheadModel.createMachine({
  initial: States.choosingFaceUpCards,
  context: zhitheadModel.initialContext,
  states: {
    [States.choosingFaceUpCards]: {
      after: {
        500: { target: States.playing, cond: hasChoosenAllFaceUpCards },
      },
      on: {
        PLAY_CARD: {
          actions: assign((context, event) => {
            context.human.offHand.faceUp.push(context.human.hand[event.index]);
            context.human.hand.splice(event.index, 1);
          }),
          target: States.choosingFaceUpCards,
          cond: (context) => !hasChoosenAllFaceUpCards(context),
        },
      },
    },
    [States.playing]: {
      on: {
        SET_SHOWN_HAND: {
          actions: assign((context, event) => {
            context.shownHand = event.shownHand;
          }),
        },
        PLAY_CARD: {
          actions: assign((context, event) => {
            const hands = [
              context.human.hand,
              context.human.offHand.faceUp,
              context.human.offHand.faceDown,
            ];
            const hand = hands.find((cards) => cards.length);
            if (!hand) return;
            context.pile.push(hand[event.index]);
            hand.splice(event.index, 1);
          }),
        },
        TAKE_CARD: {
          actions: assign((context) => {
            const card = context.deck.pop();
            if (card) context.human.hand.push(card);
          }),
        },
      },
    },
  },
});

function hasChoosenAllFaceUpCards(context: ContextFrom<typeof zhitheadModel>) {
  return context.human.offHand.faceUp.length === 3;
}

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

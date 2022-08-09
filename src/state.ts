import { assign } from "@xstate/immer";
import { ContextFrom } from "xstate";
import { createModel } from "xstate/lib/model";
import { Card, createDeck, dealCards, Player } from "./lib";
import { shuffle } from "./util";

type ShownHand = "hand" | "offhand";

interface ZhitheadContext {
  deck: Card[];
  pile: Card[];
  human: Player;
  shownHand: ShownHand;
}

function createInitialContext(): ZhitheadContext {
  const shuffledDeck = shuffle(createDeck());
  const [deck, human] = dealCards(shuffledDeck);

  return {
    deck,
    pile: [],
    human,
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

function hasChoosenAllFaceUpCards(context: ContextFrom<typeof zhitheadModel>) {
  return context.human.offHand.faceUp.length === 3;
}

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
        200: { target: States.playing, cond: hasChoosenAllFaceUpCards },
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

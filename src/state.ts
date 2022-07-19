import { assign } from "@xstate/immer";
import { createModel } from "xstate/lib/model";
import { Card, createDeck, dealCards, Player } from "./lib";
import { shuffle } from "./util";

type ShownHand = "hand" | "offhand";

interface ZhitheadContext {
  deck: Card[];
  pile: Card[];
  me: Player;
  shownHand: ShownHand;
}

function createInitialContext(): ZhitheadContext {
  const [deck, me] = dealCards(shuffle(createDeck()));

  return {
    deck,
    pile: [],
    me,
    shownHand: "hand",
  };
}

const zhitheadModel = createModel(createInitialContext(), {
  events: {
    PLAY_CARD: (index: number) => ({ index }),
    SET_SHOWN_HAND: (shownHand: ShownHand) => ({ shownHand }),
  },
});

export const zhitheadMachine = zhitheadModel.createMachine(
  {
    initial: "choosingFaceUpCards",
    context: zhitheadModel.initialContext,
    states: {
      choosingFaceUpCards: {
        after: {
          180: { target: "playing", cond: "hasChoosenAllFaceUpCards" },
        },
        on: {
          PLAY_CARD: {
            actions: assign((context, event) => {
              context.me.offHand.faceUp.push(context.me.hand[event.index]);
              context.me.hand.splice(event.index, 1);
            }),
            target: "choosingFaceUpCards",
          },
        },
      },
      playing: {
        on: {
          SET_SHOWN_HAND: {
            actions: assign((context, event) => {
              context.shownHand = event.shownHand;
            }),
          },
          PLAY_CARD: {
            actions: assign((context, event) => {
              const hands = [
                context.me.hand,
                context.me.offHand.faceUp,
                context.me.offHand.faceDown,
              ];
              const hand = hands.find((cards) => cards.length);
              if (!hand) return;
              context.pile.push(hand[event.index]);
              hand.splice(event.index, 1);
            }),
          },
        },
      },
    },
  },
  {
    guards: {
      hasChoosenAllFaceUpCards: (context) => {
        return context.me.offHand.faceUp.length === 3;
      },
    },
  }
);

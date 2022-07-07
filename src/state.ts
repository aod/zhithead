import { assign } from "@xstate/immer";
import { createModel } from "xstate/lib/model";
import { Card, createDeck, makePlayer, Player } from "./lib";
import { shuffle } from "./util";

type ShownHand = "hand" | "offhand";

interface ZhitheadContext {
  deck: Card[];
  me: Player;
  shownHand: ShownHand;
}

function createInitialContext(): ZhitheadContext {
  const deck = shuffle(createDeck());
  const me = makePlayer();
  me.hand = deck.splice(-6);
  me.offHand.faceDown = deck.splice(-3);

  return {
    deck,
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
        always: { target: "playing", cond: "hasChoosenAllFaceUpCards" },
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

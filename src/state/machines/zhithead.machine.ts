import { assign } from "@xstate/immer";
import { ContextFrom, send } from "xstate";
import { createModel } from "xstate/lib/model";
import { Card, createDeck, dealCardsFor, Player as TPlayer } from "../../lib";
import humanMachine from "./human.machine";
import { PlayerEvents, barePlayerEvent } from "../shared/player-events";
import { createBotService } from "../services/bot.service";

type Player = "bot" | "human";
export type ShownHand = "hand" | "offhand";

interface ZhitheadContext {
  deck: Card[];
  pile: Card[];
  human: TPlayer;
  bot: TPlayer;
  shownHand: {
    human: ShownHand;
    bot: ShownHand;
  };
  currentTurn: Player;
}

function createInitialContext(): ZhitheadContext {
  const shuffledDeck = shuffle(createDeck());
  const [deck, [human, bot]] = dealCardsFor(2, shuffledDeck);

  bot.offHand.faceUp = bot.hand.splice(0, 3);

  return {
    deck,
    pile: [],
    human,
    bot,
    shownHand: {
      human: "hand",
      bot: "hand",
    },
    currentTurn: "human",
  };
}

export const zhitheadModel = createModel(createInitialContext(), {
  events: {
    SET_SHOWN_HAND: (player: Player, shownHand: ShownHand) => ({
      shownHand,
      player,
    }),
    TAKE_CARD: () => ({}),
    ...barePlayerEvent("CARD_CHOSEN"),
  },
});

export enum States {
  choosingFaceUpCards = "choosingFaceUpCards",
  playing = "playing",
}

export const zhitheadMachine = zhitheadModel.createMachine(
  {
    invoke: [
      { src: humanMachine, id: "human" },
      { src: createBotService(), id: "bot" },
    ],
    initial: States.choosingFaceUpCards,
    context: zhitheadModel.initialContext,
    states: {
      [States.choosingFaceUpCards]: {
        after: {
          500: { target: States.playing, cond: hasChoosenAllFaceUpCards },
        },
        entry: send(
          (context) =>
            PlayerEvents["ASK_PICK_CARD"](
              context.pile,
              context[context.currentTurn]
            ),
          { to: () => "human" }
        ),
        on: {
          CARD_CHOSEN: {
            actions: ["playToOffhand"],
            target: States.choosingFaceUpCards,
            cond: (context) => !hasChoosenAllFaceUpCards(context),
          },
        },
      },
      [States.playing]: {
        initial: "loop",
        type: "parallel",
        states: {
          loop: {
            initial: "waitForMove",
            id: "loop",
            states: {
              waitForMove: {
                entry: send(
                  (context) =>
                    PlayerEvents["ASK_PICK_CARD"](
                      context.pile,
                      context[context.currentTurn]
                    ),
                  { to: (ctx) => ctx.currentTurn }
                ),
                on: {
                  CARD_CHOSEN: [
                    {
                      target: "#loop.waitForMove",
                      actions: ["takePile", "switchTurns"],
                      cond: (_, event) => event.card === undefined,
                    },
                    {
                      target: "#loop.delayedDraw",
                      actions: "play",
                    },
                  ],
                },
              },
              delayedDraw: {
                after: {
                  225: {
                    actions: ["takeCard", "switchTurns"],
                    target: "#loop.waitForMove",
                  },
                },
              },
            },
          },
          switcher: {
            on: {
              SET_SHOWN_HAND: {
                actions: assign((context, event) => {
                  context.shownHand[event.player] = event.shownHand;
                }),
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      switchTurns: assign((context) => {
        context.currentTurn = context.currentTurn === "bot" ? "human" : "bot";
      }),
      playToOffhand: assign((context, event) => {
        if (event.type !== "CARD_CHOSEN") return;
        context.human.offHand.faceUp.push(
          context.human.hand.find((c) => c === event.card!)!
        );
        context.human.hand.splice(context.human.hand.indexOf(event.card!), 1);
      }),
      play: assign((context, event) => {
        if (event.type !== "CARD_CHOSEN") return;
        const hand = [
          context[context.currentTurn].hand,
          context[context.currentTurn].offHand.faceUp,
          context[context.currentTurn].offHand.faceDown,
        ].find((hand) => hand.length);
        if (!hand) return;
        context.pile.push(event.card!);
        hand.splice(hand.indexOf(event.card!), 1);
      }),
      takePile: assign((context) => {
        context[context.currentTurn].hand = [
          ...context[context.currentTurn].hand,
          ...context.pile,
        ];
        context.pile = [];
      }),
      takeCard: assign((context) => {
        const card = context.deck.pop();
        if (card !== undefined) context[context.currentTurn].hand.push(card);
      }),
    },
    // guards: {
    //   invalidCard: (_, event) => {
    //     return event.type === "CARD_CHOSEN" && event.card === undefined;
    //   },
    // },
  }
);

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

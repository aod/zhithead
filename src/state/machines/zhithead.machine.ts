import { assign } from "@xstate/immer";
import { ContextFrom, EventFrom, send } from "xstate";
import { createModel } from "xstate/lib/model";
import {
  canPlay as _canPlay,
  Card,
  Cards,
  createDeck,
  dealCardsFor,
  getRank,
  isPileBurnable,
  isPlayerCurHand,
  OffHandCards,
  Player as TPlayer,
} from "../../lib";
import humanMachine from "./human.machine";
import { PlayerEvents, barePlayerEvent } from "../shared/player-events";
import { createBotService } from "../services/bot.service";

export type Player = "bot" | "human";
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

  bot.offHand.faceUp = bot.hand.splice(0, 3) as OffHandCards;

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
    TAKE_PILE: () => ({}),
    ...barePlayerEvent("CARD_CHOSEN"),
  },
});

export const zhitheadMachine = zhitheadModel.createMachine(
  {
    invoke: [
      { src: humanMachine, id: "human" },
      { src: createBotService(), id: "bot" },
    ],
    initial: "choosingFaceUpCards",
    context: zhitheadModel.initialContext,
    states: {
      choosingFaceUpCards: {
        after: {
          500: { target: "playing", cond: hasChoosenAllFaceUpCards },
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
            target: "choosingFaceUpCards",
            cond: (context) => !hasChoosenAllFaceUpCards(context),
          },
        },
      },
      playing: {
        initial: "loop",
        type: "parallel",
        states: {
          loop: {
            initial: "waitForMove",
            id: "loop",
            states: {
              waitForMove: {
                entry: [
                  send(
                    (context) =>
                      PlayerEvents["ASK_PICK_CARD"](
                        context.pile,
                        context[context.currentTurn]
                      ),
                    { to: (ctx) => ctx.currentTurn }
                  ),
                  "changeSwitcher",
                ],
                on: {
                  CARD_CHOSEN: [
                    {
                      target: "#loop.waitForMove",
                      actions: ["takePile", "changeSwitcher", "switchTurns"],
                      // Bot returns undefined when no cards could be played.
                      // event.card from human should never be null.
                      cond: (_, event) => event.card === undefined,
                    },
                    {
                      target: "#loop.afterPlay",
                      actions: "play",
                      cond: canPlay,
                    },
                    {
                      target: "#loop.waitForMove", // Ask again
                    },
                  ],
                  TAKE_PILE: {
                    target: "#loop.waitForMove",
                    actions: [
                      assign((context) => (context.shownHand.human = "hand")),
                      "takePile",
                      "switchTurns",
                    ],
                    cond: (context) => context.currentTurn === "human",
                  },
                },
              },
              afterPlay: {
                entry: "changeSwitcher",
                after: {
                  600: {
                    actions: "burnPile",
                    cond: (context) => isPileBurnable(context.pile),
                  },
                  700: {
                    actions: "takeCard",
                    cond: (context) =>
                      context.deck.length > 0 &&
                      context[context.currentTurn].hand.length < 3,
                    target: "#loop.afterPlay",
                  },
                  1000: [
                    {
                      actions: ["switchTurns"],
                      target: "#loop.waitForMove",
                      cond: (context) =>
                        isPlayerCurHand(
                          context[context.currentTurn],
                          "hand",
                          "faceUp"
                        ),
                    },
                    {
                      target: "#loop.waitForMove",
                      cond: (context) =>
                        context.currentTurn === "human" &&
                        context.pile.length > 0 &&
                        !_canPlay(
                          context.pile.at(-1)!,
                          context.pile.slice(0, -1)
                        ),
                    },
                    {
                      actions: ["takePile", "switchTurns"],
                      target: "#loop.waitForMove",
                      cond: (context) =>
                        context.currentTurn === "bot" &&
                        context.pile.length > 0 &&
                        !_canPlay(
                          context.pile.at(-1)!,
                          context.pile.slice(0, -1)
                        ),
                    },
                    {
                      actions: "switchTurns",
                      target: "#loop.waitForMove",
                    },
                  ],
                  1300: { actions: "changeSwitcher" },
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

        const player = curPlayer(context);
        const playedCard = event.card!;

        if (!isPlayerCurHand(player, "faceDown")) {
          const isHand = isPlayerCurHand(player, "hand");
          const hand = isHand ? player.hand : player.offHand.faceUp;

          const toPlay: Cards = [playedCard];
          if (event.n) {
            toPlay.push(
              ...(hand
                .filter(
                  (card) =>
                    card !== undefined &&
                    card !== playedCard &&
                    getRank(playedCard) === getRank(card)
                )
                .slice(0, event.n - 1) as Cards)
            );
          }

          for (const card of toPlay) {
            context.pile.push(card);
            if (isHand) hand.splice(hand.indexOf(card), 1);
            else hand[hand.indexOf(card)] = undefined;
          }
        } else {
          const hand = player.offHand.faceDown;
          context.pile.push(playedCard);
          hand[hand.indexOf(playedCard)] = undefined;
        }
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
      burnPile: assign((context) => {
        context.pile = [];
      }),
      changeSwitcher: assign((context) => {
        if (context[context.currentTurn].hand.length) {
          context.shownHand[context.currentTurn] = "hand";
        } else {
          context.shownHand[context.currentTurn] = "offhand";
        }
      }),
    },
  }
);

function curPlayer(context: ContextFrom<typeof zhitheadModel>) {
  return context[context.currentTurn];
}

function hasChoosenAllFaceUpCards(
  context: ContextFrom<typeof zhitheadModel>
): boolean {
  return context.human.offHand.faceUp.length === 3;
}

function canPlay(
  context: ContextFrom<typeof zhitheadModel>,
  event: EventFrom<typeof zhitheadModel>
): boolean {
  if (event.type !== "CARD_CHOSEN") return false;
  const hands = [
    context[context.currentTurn].hand,
    context[context.currentTurn].offHand.faceUp.filter(
      (card) => card !== undefined
    ),
  ];
  const firstNonEmptyVisibleHand = hands.find((hand) => hand.length);
  if (firstNonEmptyVisibleHand !== undefined) {
    return (
      firstNonEmptyVisibleHand.includes(event.card!) &&
      _canPlay(event.card!, context.pile)
    );
  }
  return true;
}

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

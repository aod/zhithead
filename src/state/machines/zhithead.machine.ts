import { assign } from "@xstate/immer";
import { ContextFrom, EventFrom, send, assign as xassign } from "xstate";
import { createModel } from "xstate/lib/model";
import {
  asCards,
  canPlay as _canPlay,
  Card,
  Cards,
  compareCards,
  createDeck,
  dealCardsFor,
  getRank,
  isPileBurnable,
  isPlayerCurHand,
  makePlayer,
  OffHandCards,
  Player as TPlayer,
  totalCards,
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
    SORT_HAND: () => ({}),
    NEW_GAME: () => ({}),
    ...barePlayerEvent("CARD_CHOSEN"),
  },
});

export const zhitheadMachine = zhitheadModel.createMachine(
  {
    predictableActionArguments: true,
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
                    cond: (context) =>
                      context.currentTurn === "human" &&
                      totalCards(context.bot) > 0,
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
                  601: {
                    target: "#won",
                    cond: (context) =>
                      (!context.pile.length ||
                        _canPlay(
                          context.pile.at(-1)!,
                          context.pile.slice(0, -1)
                        )) &&
                      totalCards(context.human) === 0,
                  },
                  602: {
                    target: "#lost",
                    cond: (context) => totalCards(context.bot) === 0,
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
                      actions: ["takePile", "changeSwitcher", "switchTurns"],
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
          sorter: {
            on: {
              SORT_HAND: {
                actions: assign((context) => {
                  context.human.hand.sort(compareCards);
                }),
              },
            },
          },
        },
      },
      won: {
        id: "won",
        on: {
          NEW_GAME: {
            actions: ["emptyCards", "createNewGame"],
            target: "choosingFaceUpCards",
          },
        },
      },
      lost: {
        id: "lost",
        on: {
          NEW_GAME: {
            actions: ["emptyCards", "createNewGame"],
            target: "choosingFaceUpCards",
          },
        },
      },
    },
  },
  {
    actions: {
      createNewGame: xassign(createInitialContext()),
      emptyCards: assign((context) => {
        context.pile = [];
        context.deck = [];
        context.human = makePlayer();
        context.bot = makePlayer();
      }),
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

        const player = currentPlayer(context);
        const playedCard = event.card!;

        if (isPlayerCurHand(player, "faceDown")) {
          const hand = player.offHand.faceDown;
          context.pile.push(playedCard);
          hand[hand.indexOf(playedCard)] = undefined;
        } else {
          const isHand = isPlayerCurHand(player, "hand");
          const hand = isHand ? player.hand : player.offHand.faceUp;

          const toPlay: Cards = [playedCard];
          if (event.n) {
            const cards = asCards(hand)
              .filter((card) => getRank(card) === getRank(playedCard))
              .filter((card) => card !== playedCard)
              .slice(0, event.n - 1);
            toPlay.push(...cards);
          }

          for (const card of toPlay) {
            context.pile.push(card);
            if (isHand) hand.splice(hand.indexOf(card), 1);
            else hand[hand.indexOf(card)] = undefined;
          }
        }
      }),
      takePile: assign((context) => {
        const player = currentPlayer(context);
        player.hand.push(...context.pile);
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
        if (isPlayerCurHand(currentPlayer(context), "hand")) {
          context.shownHand[context.currentTurn] = "hand";
        } else {
          context.shownHand[context.currentTurn] = "offhand";
        }
      }),
    },
  }
);

function currentPlayer(context: ContextFrom<typeof zhitheadModel>) {
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
  const player = currentPlayer(context);
  if (isPlayerCurHand(player, "faceDown")) return true;
  const hands = [player.hand, asCards(player.offHand.faceUp)];
  const hand = hands.find((hand) => hand.length) ?? [];
  return hand.includes(event.card!) && _canPlay(event.card!, context.pile);
}

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

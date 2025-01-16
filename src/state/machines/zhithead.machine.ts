import produce from "immer";
import { assign, sendTo, setup } from "xstate";

import {
  asCards,
  canPlay,
  Card,
  Cards,
  compareCards,
  createDeck,
  dealCardsFor,
  getRank,
  isPileBurnable,
  isPlayerCurrentHand,
  makePlayer,
  OffHandCards,
  Player as TPlayer,
  totalCards,
  shuffle,
} from "../../lib";
import humanMachine from "./human.machine";
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

export const zhitheadMachine = setup({
  actors: {
    human: humanMachine,
    bot: createBotService,
  },
  types: {
    context: {} as ZhitheadContext,
    events: {} as
      | { type: "TAKE_CARD" }
      | { type: "TAKE_PILE" }
      | { type: "CARD_CHOSEN"; card?: Card; n?: number }
      | { type: "SORT_HAND" }
      | { type: "SET_SHOWN_HAND"; player: Player; shownHand: ShownHand }
      | { type: "NEW_GAME" },
  },
  actions: {
    createNewGame: assign(createInitialContext()),
    emptyCards: assign({
      pile: [],
      deck: [],
      human: makePlayer(),
      bot: makePlayer(),
    }),
    switchTurns: assign({
      currentTurn: ({ context }) =>
        context.currentTurn === "bot" ? "human" : "bot",
    }),
    placeInOffhand: assign(({ context, event }) =>
      produce(context, (draft) => {
        if (event.type !== "CARD_CHOSEN") {
          return;
        }
        draft.human.offHand.faceUp.push(
          draft.human.hand.find((c) => c === event.card)
        );
        draft.human.hand.splice(draft.human.hand.indexOf(event.card!), 1);
      })
    ),
    play: assign(({ context, event }) =>
      produce(context, (draft) => {
        if (event.type !== "CARD_CHOSEN") return;

        const player = draft[draft.currentTurn];
        const playedCard = event.card!;

        if (isPlayerCurrentHand(player, "faceDown")) {
          const hand = player.offHand.faceDown;
          draft.pile.push(playedCard);
          hand[hand.indexOf(playedCard)] = undefined;
        } else {
          const isHand = isPlayerCurrentHand(player, "hand");
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
            draft.pile.push(card);
            if (isHand) hand.splice(hand.indexOf(card), 1);
            else hand[hand.indexOf(card)] = undefined;
          }
        }
      })
    ),
    takePile: assign(({ context }) =>
      produce(context, (draft) => {
        const player = draft[draft.currentTurn];
        player.hand.push(...draft.pile);
        draft.pile = [];
      })
    ),
    takeCard: assign(({ context }) =>
      produce(context, (draft) => {
        const card = draft.deck.pop();
        if (card !== undefined) draft[draft.currentTurn].hand.push(card);
      })
    ),
    burnPile: assign(() => ({ pile: [] })),
    changeSwitcher: assign(({ context }) =>
      produce(context, (draft) => {
        if (isPlayerCurrentHand(draft[draft.currentTurn], "hand")) {
          draft.shownHand[draft.currentTurn] = "hand";
        } else {
          draft.shownHand[draft.currentTurn] = "offhand";
        }
      })
    ),
    showHand: assign(({ context }) =>
      produce(context, (draft) => {
        draft.shownHand.human = "hand";
      })
    ),
  },
  guards: {
    hasChosenAllFaceUpCards: ({ context }) =>
      context.human.offHand.faceUp.length === 3,
    canPlay: ({ context, event }) => {
      if (event.type !== "CARD_CHOSEN") {
        return false;
      }

      const player = context[context.currentTurn];
      if (isPlayerCurrentHand(player, "faceDown")) {
        return true;
      }

      const hands = [player.hand, asCards(player.offHand.faceUp)];
      const hand = hands.find((hand) => hand.length) ?? [];
      return hand.includes(event.card!) && canPlay(event.card!, context.pile);
    },
  },
}).createMachine({
  invoke: [
    { src: "human", id: "human", input: ({ self }) => ({ parentRef: self }) },
    { src: "bot", id: "bot" },
  ],
  initial: "choosingFaceUpCards",
  context: createInitialContext(),
  states: {
    choosingFaceUpCards: {
      entry: sendTo("human", ({ context }) => ({
        type: "ASK_PICK_CARD",
        pile: context.pile,
        player: context[context.currentTurn],
      })),
      after: {
        500: {
          target: "playing",
          guard: "hasChosenAllFaceUpCards",
        },
      },
      on: {
        CARD_CHOSEN: {
          actions: "placeInOffhand",
          target: "choosingFaceUpCards",
          // guard: not("hasChosenAllFaceUpCards"),
          reenter: true,
        },
      },
    },
    playing: {
      type: "parallel",
      states: {
        loop: {
          id: "loop",
          initial: "waitForMove",
          states: {
            waitForMove: {
              entry: [
                sendTo(
                  ({ context }) => context.currentTurn,
                  ({ context }) => ({
                    type: "ASK_PICK_CARD",
                    pile: context.pile,
                    player: context[context.currentTurn],
                  })
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
                    guard: ({ event }) => event.card === undefined,
                    reenter: true,
                  },
                  {
                    target: "#loop.afterPlay",
                    actions: "play",
                    guard: "canPlay",
                  },
                  {
                    target: "#loop.waitForMove", // Ask again
                    reenter: true,
                  },
                ],
                TAKE_PILE: {
                  target: "#loop.waitForMove",
                  actions: ["showHand", "takePile", "switchTurns"],
                  guard: ({ context }) => context.currentTurn === "human",
                  reenter: true,
                },
              },
            },
            afterPlay: {
              entry: "changeSwitcher",
              after: {
                600: {
                  actions: "burnPile",
                  guard: ({ context }) => isPileBurnable(context.pile),
                },
                601: {
                  target: "#won",
                  guard: ({ context }) =>
                    (!context.pile.length ||
                      canPlay(
                        context.pile.at(-1)!,
                        context.pile.slice(0, -1)
                      )) &&
                    totalCards(context.human) === 0,
                },
                602: {
                  target: "#lost",
                  guard: ({ context }) => totalCards(context.bot) === 0,
                },
                700: {
                  actions: "takeCard",
                  guard: ({ context }) =>
                    context.deck.length > 0 &&
                    context[context.currentTurn].hand.length < 3,
                  target: "#loop.afterPlay",
                },
                1000: [
                  {
                    actions: ["switchTurns"],
                    target: "#loop.waitForMove",
                    guard: ({ context }) =>
                      isPlayerCurrentHand(
                        context[context.currentTurn],
                        "hand",
                        "faceUp"
                      ),
                  },
                  {
                    target: "#loop.waitForMove",
                    guard: ({ context }) =>
                      context.currentTurn === "human" &&
                      context.pile.length > 0 &&
                      !canPlay(context.pile.at(-1)!, context.pile.slice(0, -1)),
                  },
                  {
                    actions: ["takePile", "changeSwitcher", "switchTurns"],
                    target: "#loop.waitForMove",
                    guard: ({ context }) =>
                      context.currentTurn === "bot" &&
                      context.pile.length > 0 &&
                      !canPlay(context.pile.at(-1)!, context.pile.slice(0, -1)),
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
              actions: assign(({ context, event }) =>
                produce(context, (draft) => {
                  draft.shownHand[event.player] = event.shownHand;
                })
              ),
            },
          },
        },
        sorter: {
          on: {
            SORT_HAND: {
              actions: assign(({ context }) =>
                produce(context, (draft) => {
                  draft.human.hand.sort(compareCards);
                })
              ),
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
});

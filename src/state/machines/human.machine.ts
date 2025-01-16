import { ActorRef, sendTo, setup, Snapshot } from "xstate";

import { Card } from "../../lib";

type ChildEvent = {
  type: "CARD_CHOSEN";
  card: Card;
  n?: number;
};

type ParentActor = ActorRef<Snapshot<unknown>, ChildEvent>;

const humanMachine = setup({
  types: {
    events: {} as
      | { type: "ASK_PICK_CARD" }
      | { type: "CHOOSE_CARD"; card: Card; n?: number },
    input: {} as { parentRef: ParentActor },
  },
}).createMachine({
  id: "human",
  initial: "idle",
  context: ({ input: { parentRef } }) => ({ parentRef }),
  states: {
    idle: {
      on: {
        ASK_PICK_CARD: { target: "waitingForHuman" },
      },
    },
    waitingForHuman: {
      on: {
        CHOOSE_CARD: {
          actions: sendTo(
            ({ context }) => context.parentRef,
            ({ event }) => ({
              type: "CARD_CHOSEN",
              card: event.card,
              n: event.n,
            })
          ),
          target: "idle",
        },
      },
    },
  },
});

export default humanMachine;

import { createMachine } from "xstate";
import { sendParent } from "xstate/lib/actions";
import { Card } from "../../lib";
import { PlayerEvents } from "../shared/player-events";

type HumanEvents =
  | { type: "ASK_PICK_CARD" }
  | { type: "CHOOSE_CARD"; card: Card; n?: number };

const humanMachine = createMachine<null, HumanEvents>({
  predictableActionArguments: true,
  id: "human",
  initial: "idle",
  states: {
    idle: {
      on: {
        ASK_PICK_CARD: { target: "waitingForHuman" },
      },
    },
    waitingForHuman: {
      on: {
        CHOOSE_CARD: {
          actions: sendParent((_, event) =>
            PlayerEvents["CARD_CHOSEN"](event.card, event.n)
          ),
          target: "idle",
        },
      },
    },
  },
});

export default humanMachine;

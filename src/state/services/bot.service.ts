import { fromCallback } from "xstate";

import { bot } from "../../bot";
import { Card, Pile, Player } from "../../lib";

const MIN_DELAY = 450;
const MAX_DELAY = 750;

type Events =
  | {
      type: "ASK_PICK_CARD";
      pile: Pile;
      player: Player;
    }
  | {
      type: "CHOOSE_CARD";
      card: Card;
      n?: number;
    };

export const createBotService = fromCallback<Events>(
  ({ receive, sendBack }) => {
    let id: number | undefined;
    receive((event) => {
      if (event.type !== "ASK_PICK_CARD") {
        return;
      }
      id = delayedTimeout(MIN_DELAY, MAX_DELAY, () =>
        sendBack({
          type: "CARD_CHOSEN",
          card: bot(event.pile, event.player),
          n: undefined,
        })
      );
    });
    return () => clearTimeout(id);
  }
);

function delayedTimeout(low: number, high: number, cb: () => void) {
  const timeout = low + Math.floor(Math.random() * (high - low));
  return window.setTimeout(cb, timeout);
}

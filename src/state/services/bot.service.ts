import { ContextFrom, EventFrom, InvokeCreator } from "xstate";
import { bot } from "../../bot";
import { zhitheadModel } from "../machines/zhithead.machine";

const MIN_DELAY = 450;
const MAX_DELAY = 750;

export function createBotService(): InvokeCreator<
  ContextFrom<typeof zhitheadModel>,
  EventFrom<typeof zhitheadModel>
> {
  return () => (callback, onReceive) => {
    let id: ReturnType<typeof delayedTimeout>;

    // TODO: How to get correct typing here?
    onReceive((e) => {
      if (e.type === "ASK_PICK_CARD") {
        id = delayedTimeout(MIN_DELAY, MAX_DELAY, () =>
          callback({
            type: "CARD_CHOSEN",
            card: bot(e.pile, e.player),
            n: undefined,
          })
        );
      }
    });

    return () => clearTimeout(id);
  };
}

function delayedTimeout(low: number, high: number, cb: () => void) {
  const timeout = low + Math.floor(Math.random() * (high - low));
  return setTimeout(cb, timeout);
}

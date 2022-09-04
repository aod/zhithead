import { Card, Pile, Player } from "../../lib";

const events = {
  ASK_PICK_CARD: (pile: Pile, player: Player) => ({ pile, player }),
  CARD_CHOSEN: (card?: Card, n?: number) => ({ card, n }),
};

export const PlayerEvents = {
  ...makeActionCreator("ASK_PICK_CARD"),
  ...makeActionCreator("CARD_CHOSEN"),
};

/** A player event without `type` prop. */
export function barePlayerEvent<K extends keyof typeof events>(k: K) {
  const _fn = events[k];
  type Result = Record<K, typeof _fn>;
  return { [k]: _fn } as Result;
}

/** Injects `type` prop equal to `evName` in return value of event function. */
function makeActionCreator<EvKeys extends keyof typeof events>(evName: EvKeys) {
  const _fn = events[evName];
  type Params = Parameters<typeof _fn>;
  type Return = ReturnType<typeof _fn>;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const fn = (...args: Params): Return => _fn(...args);
  type Result = Record<EvKeys, (...args: Params) => Return & { type: EvKeys }>;
  return {
    [evName]: (...args: Params) => ({ ...fn(...args), type: evName }),
  } as Result;
}

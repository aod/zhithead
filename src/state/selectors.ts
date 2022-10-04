import { StateFrom } from "xstate";
import { zhitheadMachine } from "./machines/zhithead.machine";

interface Selector {
  (state: StateFrom<typeof zhitheadMachine>): boolean;
}

export const isChoosingFaceUpCardsStor: Selector = (state) =>
  state.matches("choosingFaceUpCards");

export const isPlayingStor: Selector = (state) => state.matches("playing");

export const isGameOverStor: Selector = (state) =>
  ["won", "lost"].some(state.matches);
export const hasWonStor: Selector = (state) => state.matches("won");
export const hasLostStor: Selector = (state) => state.matches("lost");

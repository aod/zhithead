import { StateFrom } from "xstate";
import { zhitheadMachine } from "./machines/zhithead.machine";

export const isChoosingFaceUpCardsStor = (
  state: StateFrom<typeof zhitheadMachine>
) => state.matches("choosingFaceUpCards");

export const isPlayingStor = (state: StateFrom<typeof zhitheadMachine>) =>
  state.matches("playing");

import { StateFrom } from "xstate";
import { zhitheadMachine, States } from "./machines/zhithead.machine";

export const isChoosingFaceUpCardsStor = (
  state: StateFrom<typeof zhitheadMachine>
) => state.matches(States.choosingFaceUpCards);

export const isPlayingStor = (state: StateFrom<typeof zhitheadMachine>) =>
  state.matches(States.playing);

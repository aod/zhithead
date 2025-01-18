import { SnapshotFrom } from "xstate";

import { zhitheadMachine, Player } from "./machines/zhithead.machine";

type State = SnapshotFrom<typeof zhitheadMachine>;

export const isChoosingFaceUpCards = (state: State) =>
  state.matches("choosingFaceUpCards");
export const isPlaying = (state: State) => state.matches("playing");
export const hasWon = (state: State) => state.matches("won");
export const hasLost = (state: State) => state.matches("lost");
export const isGameOver = (state: State) =>
  state.matches("won") || state.matches("lost");

export const getPile = (state: State) => state.context.pile;
export const getDeck = (state: State) => state.context.deck;

export const getPlayerHand = (player: Player) => (state: State) =>
  state.context[player].hand;
export const getPlayerOffHand = (player: Player) => (state: State) =>
  state.context[player].offHand;
export const getPlayerShownHand = (player: Player) => (state: State) =>
  state.context.shownHand[player];

export const getHumanActor = (state: State) => state.children.human;

export const getHistory = (state: State) => state.context.history;

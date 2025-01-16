import { SnapshotFrom } from "xstate";
import { zhitheadMachine, Player } from "./machines/zhithead.machine";

type State = SnapshotFrom<typeof zhitheadMachine>;

export const isChoosingFaceUpCards = (state: State) =>
  state.matches("choosingFaceUpCards");

export const isPlaying = (state: State) => state.matches("playing");

export const isGameOver = (state: State) =>
  state.matches("won") || state.matches("lost");
export const hasWon = (state: State) => state.matches("won");
export const hasLost = (state: State) => state.matches("lost");

export const getHumanOffHand = (state: State) => state.context.human.offHand;
export const getHumanHandLength = (state: State) =>
  state.context.human.hand.length;

export const getPile = (state: State) => state.context.pile;
export const getDeck = (state: State) => state.context.deck;

export const getPlayerHand = (player: Player) => (state: State) =>
  state.context[player].hand;
export const getPlayerOffHand = (player: Player) => (state: State) =>
  state.context[player].offHand;
export const getPlayerShownHand = (player: Player) => (state: State) =>
  state.context.shownHand[player];

export const getShownHand = (player: Player) => (state: State) =>
  state.context.shownHand[player];
export const getHand = (player: Player) => (state: State) =>
  state.context[player].hand;
export const getOffHand = (player: Player) => (state: State) =>
  state.context[player].offHand;
export const getHumanActor = (state: State) => state.children.human;

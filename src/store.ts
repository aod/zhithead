import { proxy } from "valtio";
import { createGame, Game, dealCards, playCard } from "./lib";

type ShownHand = "hand" | "offhand";

interface Store {
  game: Game;
  shownHand: ShownHand;
}

export const store = proxy<Store>({
  game: dealCards(createGame()),
  shownHand: "hand",
});

export const actions = {
  playCard(handCardIndex: number) {
    store.game = playCard(store.game, handCardIndex);
  },
  setShownHand(value: ShownHand) {
    store.shownHand = value;
  },
};

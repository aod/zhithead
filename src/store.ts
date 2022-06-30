import { proxy } from "valtio";
import {
  createGame,
  Game,
  StateKind,
  dealCards,
  playCard,
  setState,
} from "./lib";

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
    switch (store.game.state.kind) {
      case StateKind.ChoosingOffHandFaceUpCards:
        if (store.game.me.offHand.faceUp.length < 3) {
          store.game = playCard(
            store.game,
            handCardIndex,
            store.game.me.offHand.faceUp.length
          );
          if (store.game.me.offHand.faceUp.length === 3) {
            store.game = setState(store.game, { kind: StateKind.Playing });
          }
        }
        break;
    }
  },
  setShownHand(value: ShownHand) {
    store.shownHand = value;
  },
};

import { proxy } from "valtio";
import { createGame, Game, StateKind, dealCards, playCard } from "./lib";

interface Store {
  game: Game;
}

export const store = proxy<Store>({
  game: dealCards(createGame()),
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
        }
        break;
    }
  },
};

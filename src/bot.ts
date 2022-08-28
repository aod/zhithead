import { Card, Cards, getRank, Pile, playableCards, Player } from "./lib";

export function bot(pile: Pile, player: Player): Card | undefined {
  const visibleHand = [player.hand, player.offHand.faceUp].find(
    (hand) => hand.length
  );
  if (visibleHand !== undefined) {
    const playable = playableCards(pile);
    const choice = visibleHand.filter((card) =>
      playable.some((playableCard) => getRank(playableCard) === getRank(card))
    );
    return lowest(choice);
  }
  if (player.offHand.faceDown.length) {
    const faceDown = player.offHand.faceDown;
    return faceDown[Math.floor(Math.random() * faceDown.length)];
  }
}

function sortAsc(cards: Cards): Cards {
  return cards.slice().sort((a, b) => getRank(a) - getRank(b));
}

function lowest(cards: Cards): Card | undefined {
  return sortAsc(cards).at(0);
}

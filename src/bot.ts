import { Card, Cards, getRank, Pile, playableCards, Player } from "./lib";

export function bot(pile: Pile, player: Player): Card | undefined {
  const visibleHand = [
    player.hand,
    player.offHand.faceUp.filter((card) => card !== undefined) as Cards,
  ].find((hand) => hand.length);
  if (visibleHand !== undefined) {
    const playable = playableCards(pile);
    const choice = visibleHand.filter((card) =>
      playable.some((playableCard) => getRank(playableCard) === getRank(card))
    );
    if (!choice.length) return;
    return choice[Math.floor(Math.random() * choice.length)];
  }
  return player.offHand.faceDown.find((card) => card !== undefined);
}

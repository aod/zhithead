import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import Card from "./Card";
import { createCard, Rank, Suite, Card as LibCard } from "./lib";

export default function Hand() {
  const hand = useMemo(
    () => [
      createCard(Suite.Clubs, Rank.Num6),
      createCard(Suite.Clubs, Rank.Num9),
      createCard(Suite.Diamonds, Rank.Num2),
      createCard(Suite.Diamonds, Rank.Ace),
      createCard(Suite.Hearts, Rank.Queen),
      createCard(Suite.Hearts, Rank.King),
      createCard(Suite.Hearts, Rank.Jack),
      createCard(Suite.Hearts, Rank.Ace),
      createCard(Suite.Hearts, Rank.Num4),
      createCard(Suite.Hearts, Rank.Num2),
      createCard(Suite.Hearts, Rank.Num6),
      createCard(Suite.Hearts, Rank.Num9),
    ],
    []
  );

  const width = 165;
  const overlap = width / 1.75;

  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);
  const [played, setPlayed] = useState<LibCard[]>([]);

  const nonPlayedCards = useMemo(
    () => hand.filter((card) => !played.includes(card)),
    [hand, played]
  );

  function offsetFromCentered(index: number) {
    const parentIdx = Math.floor(nonPlayedCards.length / 2);
    const nonPlayedCurrentCardIdx = nonPlayedCards.findIndex(
      (card) => card === hand[index]
    );
    const hasBeenPlayed = nonPlayedCurrentCardIdx === -1;
    return hasBeenPlayed ? 0 : nonPlayedCurrentCardIdx - parentIdx;
  }

  function offsetFromHovered(index: number) {
    if (hoveredCardIdx === null) return null;
    const hoveredCardInNonPlayedCardsIdx = nonPlayedCards.findIndex(
      (card) => card === hand[hoveredCardIdx]
    );
    const nonPlayedCurrentCardIdx = nonPlayedCards.findIndex(
      (card) => card === hand[index]
    );
    const hasBeenPlayed = nonPlayedCurrentCardIdx === -1;
    return hasBeenPlayed
      ? 0
      : nonPlayedCurrentCardIdx - hoveredCardInNonPlayedCardsIdx;
  }

  function sign(n: number) {
    if (n > 0) return 1;
    if (n < 0) return -1;
    return 0;
  }

  const variants = {
    played: {
      left: "50%",
      top: "50%",
      translateY: "-50%",
      y: 0,
    },
    show: (idx: number) => ({
      x:
        offsetFromHovered(idx) === null
          ? 0
          : { [1]: overlap / 3 }[offsetFromHovered(idx)!] ?? 0,
      y:
        Math.abs(offsetFromCentered(idx)) ** 1.75 +
        (offsetFromHovered(idx) === null
          ? 0
          : [-35, -15][Math.abs(offsetFromHovered(idx)!)] ?? 0),
      transition: {
        delay: hoveredCardIdx === null ? idx * 0.02 : 0,
      },
      rotate: `${
        offsetFromCentered(idx) * 1 +
        (offsetFromHovered(idx) === null
          ? 0
          : ([0, 1.5][Math.abs(offsetFromHovered(idx)!)] ?? 0) *
            sign(offsetFromHovered(idx)!))
      }deg`,
      scale:
        offsetFromHovered(idx) === null
          ? 1
          : [1.3, 1.15].at(Math.abs(offsetFromHovered(idx)!)) ?? 1,
    }),
    hidden: {
      y: 400,
    },
  };

  return (
    <div
      className="flex w-full flex-nowrap items-end justify-center pb-16"
      style={{ paddingLeft: overlap }}
    >
      {hand.map((card, idx) => (
        <motion.div
          custom={idx}
          initial="hidden"
          animate={played.includes(hand[idx]) ? "played" : "show"}
          variants={variants}
          onHoverStart={() => !played.includes(card) && setHoveredCardIdx(idx)}
          onHoverEnd={() => setHoveredCardIdx(null)}
          style={{
            marginLeft: -overlap,
            width,
            position: played.includes(card) ? "absolute" : "initial",
            zIndex: Math.max(
              played.findIndex((val) => val === card),
              0
            ),
          }}
          key={card}
          onClick={() => {
            setHoveredCardIdx(null);
            setPlayed([...played, card]);
          }}
        >
          <Card card={card} />
        </motion.div>
      ))}
    </div>
  );
}

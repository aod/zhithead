import { motion } from "framer-motion";
import { useState } from "react";
import Card from "./Card";
import { createCard, Rank, Suite, Card as LibCard } from "./lib";

export default function Hand() {
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);
  const [played, setPlayed] = useState<LibCard[]>([]);

  const hand = [
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
  ];

  const width = 175;
  const overlap = width / 2;

  const createVariant = (isRight: boolean) => ({
    rotate: `${3 * (isRight ? 1 : -1)}deg`,
    translateY: "-10%",
    scale: 1.1,
    translateX: `${12.5 * (isRight ? 1 : -1)}%`,
  });
  const variants = {
    left: createVariant(false),
    right: createVariant(true),
    played: {
      left: "50%",
      top: "50%",
      translateY: "-50%",
    },
  };

  const chooseVariant = (index: number) => {
    if (played.includes(hand[index])) return "played";
    if (hoveredCardIdx === null) return;
    const nonPlayedCards = hand.filter((card) => !played.includes(card));
    const nonPlayedHoveredCardIdx = nonPlayedCards.findIndex(
      (card) => card === hand[hoveredCardIdx]
    );
    if (nonPlayedCards[nonPlayedHoveredCardIdx - 1] === hand[index])
      return "left";
    if (nonPlayedCards[nonPlayedHoveredCardIdx + 1] === hand[index])
      return "right";
  };

  return (
    <div
      className="flex w-full flex-nowrap items-end justify-center pb-8"
      style={{ paddingLeft: overlap }}
    >
      {hand.map((card, i) => (
        <motion.div
          animate={chooseVariant(i)}
          variants={variants}
          whileHover={
            played.includes(card) ? {} : { scale: 1.2, translateY: "-20%" }
          }
          whileTap={{ scale: 1 }}
          onHoverStart={() => !played.includes(card) && setHoveredCardIdx(i)}
          onHoverEnd={() => setHoveredCardIdx(null)}
          className="origin-center"
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
            setPlayed([...played, card]);
            setHoveredCardIdx(null);
          }}
        >
          <Card card={card} />
        </motion.div>
      ))}
    </div>
  );
}

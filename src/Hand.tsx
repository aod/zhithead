import { motion } from "framer-motion";
import { useState } from "react";
import Card from "./Card";
import { createCard, Rank, Suite } from "./lib";

export default function Hand() {
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number>(-2);

  const deck = [
    createCard(Suite.Clubs, Rank.Num6),
    createCard(Suite.Clubs, Rank.Num9),
    createCard(Suite.Hearts, Rank.Queen),
    createCard(Suite.Hearts, Rank.King),
    createCard(Suite.Hearts, Rank.King),
    createCard(Suite.Hearts, Rank.King),
    createCard(Suite.Hearts, Rank.King),
    createCard(Suite.Hearts, Rank.King),
    createCard(Suite.Hearts, Rank.King),
  ];

  const width = 200;
  const overlap = width / 2;

  const variants = {
    left: {
      rotate: "-3deg",
      translateY: "-10%",
      scale: 1.1,
      translateX: `-12.5%`,
    },
    right: {
      rotate: "3deg",
      translateY: "-10%",
      scale: 1.1,
      translateX: `12.5%`,
    },
  };

  const siblings: Record<number, string> = {
    [-1]: "right",
    [1]: "left",
  };

  return (
    <div
      className="flex w-full flex-nowrap items-end justify-center overflow-hidden py-[200px]"
      style={{ paddingLeft: overlap }}
    >
      {deck.map((card, i) => (
        <motion.div
          drag
          dragElastic={0.2}
          animate={siblings[hoveredCardIdx - i]}
          variants={variants}
          dragConstraints={{ left: 0, right: 0, bottom: 0, top: -50 }}
          whileHover={{ scale: 1.2, translateY: "-20%" }}
          whileTap={{ scale: 1 }}
          onHoverStart={() => setHoveredCardIdx(i)}
          onHoverEnd={() => setHoveredCardIdx(-2)}
          className="origin-center"
          style={{
            marginLeft: -overlap,
            width,
          }}
          key={i}
        >
          <Card card={card} />
        </motion.div>
      ))}
    </div>
  );
}

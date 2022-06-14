import { motion } from "framer-motion";
import { useState } from "react";
import useMeasure from "react-use-measure";
import Card from "./Card";
import { createCard, Rank, Suite } from "./lib";

export default function Hand() {
  const [ref, rect] = useMeasure();
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

  const width = 170;
  const pad = width / 2;
  const totalWidth = width + deck.length * pad;
  const startPos = rect.width / 2 - totalWidth / 2;

  const variants = {
    left: {
      rotate: "-3deg",
      translateY: "-10%",
      transformOrigin: "bottom right",
    },
    none: {},
    right: {
      rotate: "3deg",
      translateY: "-10%",
      transformOrigin: "bottom left",
    },
  };

  const siblings: Record<number, string> = {
    [-1]: "right",
    [1]: "left",
  };

  return (
    <div ref={ref} className="relative w-full">
      {deck.map((card, i) => (
        <motion.div
          drag
          dragElastic
          animate={siblings[hoveredCardIdx - i]}
          variants={variants}
          dragConstraints={{ left: 0, right: 0, bottom: 0, top: -400 }}
          whileHover={{ scale: 1.15, translateY: "-20%" }}
          whileTap={{ scale: 1 }}
          onHoverStart={() => setHoveredCardIdx(i)}
          onHoverEnd={() => setHoveredCardIdx(-2)}
          className={"absolute"}
          style={{
            left: startPos + i * pad,
            width: width,
          }}
          key={i}
        >
          <Card card={card} />
        </motion.div>
      ))}
    </div>
  );
}

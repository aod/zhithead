import { motion, Variants } from "framer-motion";
import { useSnapshot } from "valtio";
import Card from "./Card";
import { store } from "./store";

export default function OffHand() {
  const snap = useSnapshot(store);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex gap-2"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={snap.game.me.offHand.faceUp[index] ?? `i${index}`}
          variants={item}
        >
          {snap.game.me.offHand.faceUp[index] === undefined ? (
            <Card flipped />
          ) : (
            <Card card={snap.game.me.offHand.faceUp[index]} />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

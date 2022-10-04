import { useSelector } from "@xstate/react";
import { motion, Variants } from "framer-motion";
import { useContext, useState } from "react";
import { hasWonStor } from "../state/selectors";
import { GlobalStateContext } from "./providers/GlobalStateProvider";

export default function ResultOverlay() {
  const { zhitheadService: zh } = useContext(GlobalStateContext);
  const { send } = zh;

  const _hasWon = useSelector(zh, hasWonStor);
  const [hasWon, setHasWon] = useState<boolean | null>(null);
  if (hasWon === null) setHasWon(_hasWon);

  const msgs = {
    won: {
      header: "You Won!",
      button: "Play again?",
    },
    lost: {
      header: "You lose.",
      button: "Try again?",
    },
  };

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.66,
        delayChildren: 1.5,
      },
    },
  };

  const text: Variants = {
    hidden: {
      y: 40,
      opacity: 0,
      transition: { type: "tween" },
    },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "tween" },
    },
  };

  function restart() {
    send({ type: "NEW_GAME" });
  }

  return (
    <motion.div
      className="absolute bottom-0 z-10 h-full w-full overflow-hidden bg-gradient-to-t from-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="flex h-full items-end justify-center pb-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="flex items-end gap-4"
        >
          <motion.h2 variants={text} className="text-3xl text-white">
            {hasWon ? msgs.won.header : msgs.lost.header}
          </motion.h2>
          <motion.button
            onClick={restart}
            variants={text}
            className="text-white underline"
          >
            {hasWon ? msgs.won.button : msgs.lost.button}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

import { useActor } from "@xstate/react";
import { motion, Variants } from "framer-motion";
import { useContext } from "react";
import Card from "./Card";
import { GlobalStateContext } from "./GlobalStateProvider";

export default function OffHand() {
  const globalServices = useContext(GlobalStateContext);
  const [state] = useActor(globalServices.zhitheadService);

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
      className="flex justify-center gap-2"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={state.context.me.offHand.faceUp[index] ?? `i${index}`}
          variants={item}
        >
          {state.context.me.offHand.faceUp[index] === undefined ? (
            <Card flipped />
          ) : (
            <Card card={state.context.me.offHand.faceUp[index]} />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

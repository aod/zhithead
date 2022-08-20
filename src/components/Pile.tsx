import { useSelector } from "@xstate/react";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import Card from "./Card";
import Count from "./Count";
import { GlobalStateContext } from "./GlobalStateProvider";

export default function Pile() {
  const { zhitheadService } = useContext(GlobalStateContext);
  const pile = useSelector(zhitheadService, (state) => state.context.pile);

  return (
    <div className="relative box-content flex h-card-height w-card-width justify-center rounded-xl border-2 border-dashed border-zinc-600 p-0.5">
      {pile.length >= 2 && (
        <div className="absolute">
          <Card card={pile.at(-2)} />
        </div>
      )}
      {pile.length >= 1 && (
        <div className="absolute">
          <Card key={pile.length} card={pile.at(-1)} z={2} />
        </div>
      )}
      <Count count={pile.length} position="left" z={3} />
      <AnimatePresence>{!pile.length && <Text />}</AnimatePresence>
    </div>
  );
}

function Text() {
  return (
    <motion.div
      className="absolute flex h-full w-full items-center justify-center"
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      <span className="select-none text-4xl font-bold tracking-wider text-zinc-600">
        PILE
      </span>
    </motion.div>
  );
}

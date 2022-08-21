import { useSelector } from "@xstate/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";
import HumanHand from "./HumanHand";
import OffHand from "./OffHand";

export default function ShownHand() {
  const { zhitheadService } = useContext(GlobalStateContext);
  const shownHand = useSelector(
    zhitheadService,
    (state) => state.context.shownHand
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={shownHand}
        className={clsx(
          "absolute h-card-height w-full",
          shownHand === "hand" && "-bottom-5",
          shownHand === "offhand" && "bottom-4 flex justify-center"
        )}
      >
        {shownHand === "hand" && <HumanHand />}
        {shownHand === "offhand" && <OffHand />}
      </motion.div>
    </AnimatePresence>
  );
}

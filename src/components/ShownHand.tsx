import { useSelector } from "@xstate/react";
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
      <motion.div key={shownHand}>
        {shownHand === "hand" && <HumanHand />}
        {shownHand === "offhand" && <OffHand />}
      </motion.div>
    </AnimatePresence>
  );
}

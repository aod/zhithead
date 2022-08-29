import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ShownHand } from "../state/machines/zhithead.machine";
import Hand, { HandProps } from "./ui/Hand";
import OffHand, { OffHandProps } from "./ui/OffHand";

interface ShownHandViewProps {
  shownHand: ShownHand;
  hand: HandProps;
  offHand: OffHandProps;
  flipped?: boolean;
}

export default function ShownHandView(props: ShownHandViewProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={props.shownHand}
        className={clsx(
          "absolute h-card-height w-full",
          props.shownHand === "hand" &&
            (props.flipped ? "-top-5" : "-bottom-2.5"),
          props.shownHand === "offhand" &&
            (props.flipped ? "top-20" : "bottom-20")
        )}
      >
        {props.shownHand === "hand" && <Hand {...props.hand} />}
        {props.shownHand === "offhand" && <OffHand {...props.offHand} />}
      </motion.div>
    </AnimatePresence>
  );
}

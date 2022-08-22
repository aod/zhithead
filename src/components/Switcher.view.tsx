import { LayoutGroup, motion } from "framer-motion";
import { PropsWithChildren, useId } from "react";
import Count from "./Count";
import { ShownHand } from "../state";

interface SwitcherViewProps {
  handCount: number;
  offHandCount: number;
  shownHand: ShownHand;
  onSwitch: (shownHand: ShownHand) => void;
  flipped?: boolean;
}

export default function SwitcherView(props: SwitcherViewProps) {
  const layoutGroupId = useId();
  const flippedSign = props.flipped ? -1 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 * flippedSign }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center"
    >
      <div className="flex items-center rounded-full border-4 border-black bg-black">
        <LayoutGroup id={layoutGroupId}>
          <Option onClick={() => props.onSwitch("hand")}>
            Hand
            {props.shownHand === "hand" && <Selected />}
            <Count
              count={props.handCount}
              position={props.flipped ? "bottom-left" : "top-left"}
              z={2}
            />
          </Option>
          <Option onClick={() => props.onSwitch("offhand")}>
            Off-Hand
            {props.shownHand === "offhand" && <Selected />}
            <Count
              count={props.offHandCount}
              position={props.flipped ? "bottom-right" : "top-right"}
              z={2}
            />
          </Option>
        </LayoutGroup>
      </div>
    </motion.div>
  );
}

function Option(props: PropsWithChildren<{ onClick?: () => void }>) {
  return (
    <span
      className="relative flex h-full cursor-pointer select-none items-center py-1.5 px-4 font-semibold tracking-wide text-zinc-200"
      onClick={props.onClick}
    >
      {props.children}
    </span>
  );
}

function Selected() {
  return (
    <motion.div
      initial={{ opacity: 0.2 }}
      animate={{ opacity: 0.2 }}
      layoutId="selected"
      className="absolute left-0 top-0 h-full w-full rounded-2xl bg-zinc-400"
    />
  );
}

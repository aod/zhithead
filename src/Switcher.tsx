import { LayoutGroup, motion } from "framer-motion";
import { PropsWithChildren } from "react";
import { useSnapshot } from "valtio";
import { actions, store } from "./store";

export default function Switcher() {
  const snap = useSnapshot(store);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center gap-4"
    >
      <LayoutGroup>
        <Option onClick={() => actions.setShownHand("hand")}>
          Hand
          {snap.shownHand === "hand" && <Selected />}
        </Option>
        <Option onClick={() => actions.setShownHand("offhand")}>
          Off-Hand
          {snap.shownHand === "offhand" && <Selected />}
        </Option>
      </LayoutGroup>
    </motion.div>
  );
}

function Option(props: PropsWithChildren<{ onClick?: () => void }>) {
  return (
    <span
      className="relative cursor-pointer select-none py-1.5 px-4 font-semibold tracking-wide text-zinc-200"
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
      className="absolute left-0 top-0 h-full w-full  rounded-2xl bg-zinc-200"
    />
  );
}
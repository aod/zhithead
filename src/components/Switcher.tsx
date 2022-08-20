import { LayoutGroup, motion } from "framer-motion";
import { PropsWithChildren, useContext } from "react";
import { useActor, useSelector } from "@xstate/react";
import { GlobalStateContext } from "./GlobalStateProvider";
import clsx from "clsx";

export default function Switcher() {
  const { zhitheadService } = useContext(GlobalStateContext);
  const [state, send] = useActor(zhitheadService);
  const hand = useSelector(
    zhitheadService,
    (state) => state.context.human.hand
  );
  const offHand = useSelector(
    zhitheadService,
    (state) => state.context.human.offHand
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center"
    >
      <div className="h-full rounded-2xl bg-zinc-300/20 py-1">
        <LayoutGroup>
          <Option
            onClick={() => send({ type: "SET_SHOWN_HAND", shownHand: "hand" })}
          >
            <Count count={hand.length} position="left" />
            Hand
            {state.context.shownHand === "hand" && <Selected />}
          </Option>
          <Option
            onClick={() =>
              send({ type: "SET_SHOWN_HAND", shownHand: "offhand" })
            }
          >
            <Count
              count={offHand.faceDown.length + offHand.faceUp.length}
              position="right"
            />
            Off-Hand
            {state.context.shownHand === "offhand" && <Selected />}
          </Option>
        </LayoutGroup>
      </div>
    </motion.div>
  );
}

function Count(props: { count: number; position: "left" | "right" }) {
  return (
    <div
      className={clsx(
        "absolute z-[1] flex h-8 w-8 items-center justify-center rounded-full bg-black p-2 text-xs text-zinc-200",
        props.position === "left" && "-left-4 -top-4",
        props.position === "right" && "-right-4 -top-4"
      )}
    >
      {props.count}
    </div>
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
      className="absolute left-0 top-0 h-full w-full rounded-2xl bg-zinc-200"
    />
  );
}

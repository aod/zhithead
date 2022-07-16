import { LayoutGroup, motion } from "framer-motion";
import { PropsWithChildren, useContext } from "react";
import { useActor } from "@xstate/react";
import { GlobalStateContext } from "./GlobalStateProvider";

export default function Switcher() {
  const globalServices = useContext(GlobalStateContext);
  const [state, send] = useActor(globalServices.zhitheadService);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center gap-4"
    >
      <LayoutGroup>
        <Option
          onClick={() => send({ type: "SET_SHOWN_HAND", shownHand: "hand" })}
        >
          Hand
          {state.context.shownHand === "hand" && <Selected />}
        </Option>
        <Option
          onClick={() => send({ type: "SET_SHOWN_HAND", shownHand: "offhand" })}
        >
          Off-Hand
          {state.context.shownHand === "offhand" && <Selected />}
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

import { LayoutGroup, motion } from "framer-motion";
import { PropsWithChildren, useId } from "react";
import Count from "./Count";

interface SwitcherProps {
  left: [string, number];
  right: [string, number];
  state: "left" | "right";
  onSwitch: (val: "left" | "right") => void;
  position: "bottom" | "top";
}

export default function Switcher(props: SwitcherProps) {
  const layoutGroupId = useId();
  const sign = props.position === "top" ? -1 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 * sign }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 * sign }}
      className="flex items-center justify-center"
    >
      <div className="flex items-center rounded-full border-4 border-black bg-black">
        <LayoutGroup id={layoutGroupId}>
          <Option onClick={() => props.onSwitch("left")}>
            {props.left[0]}
            {props.state === "left" && <Selected />}
            <Count
              count={props.left[1]}
              position={props.position === "top" ? "bottom-left" : "top-left"}
              z={2}
            />
          </Option>
          <Option onClick={() => props.onSwitch("right")}>
            {props.right[0]}
            {props.state === "right" && <Selected />}
            <Count
              count={props.right[1]}
              position={props.position === "top" ? "bottom-right" : "top-right"}
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
      className="relative flex h-full cursor-pointer select-none items-center py-0.5 px-2 text-xs font-semibold tracking-wide text-zinc-200 md:py-1.5 md:px-4 md:text-base"
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

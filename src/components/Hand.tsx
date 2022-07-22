import { useSelector } from "@xstate/react";
import { motion, Variants } from "framer-motion";
import { useContext, useRef, useState } from "react";
import Card from "./Card";
import { GlobalStateContext } from "./GlobalStateProvider";
import { offsetFromCenter, Option } from "../util";

export default function Hand() {
  const globalServices = useContext(GlobalStateContext);
  const hand = useSelector(
    globalServices.zhitheadService,
    (state) => state.context.me.hand
  );
  const { send } = globalServices.zhitheadService;

  const [hoveredCardIdx, setHoveredCardIdx] = useState<Option<number>>(
    Option.None()
  );
  const hasHoveredAtLeastOnce = useRef(false);
  hasHoveredAtLeastOnce.current ||= hoveredCardIdx.isSome();

  function offsetFromHovered(index: number): Option<number> {
    return hoveredCardIdx.map((i) => index - i);
  }

  const variants: Variants = {
    show: (idx: number) => ({
      x: offsetFromHovered(idx)
        .filter((i) => i === 1)
        .mapOr(0, () => 30),
      y:
        Math.abs(offsetFromCenter(hand, idx)) ** 1.75 +
        offsetFromHovered(idx)
          .map((i) => new Option([-20, -12.5].at(Math.abs(i))))
          .flatten()
          .unwrapOr(0),
      transition: {
        delay: hasHoveredAtLeastOnce.current
          ? 0
          : hoveredCardIdx.map(() => 0).unwrapOr(idx * 0.04),
      },
      rotate: `${
        offsetFromCenter(hand, idx) +
        offsetFromHovered(idx)
          .filter((i) => Math.abs(i) === 1)
          .mapOr(0, (i) => i * 1.5)
      }deg`,
      scale: offsetFromHovered(idx)
        .map((i) => new Option([1.2, 1.1].at(Math.abs(i))))
        .flatten()
        .unwrapOr(1),
    }),
    hidden: {
      y: 400,
    },
  };

  return (
    <div className="flex h-card-height w-full flex-nowrap items-end justify-center pl-card-x-overlap">
      {hand.map((card, idx) => (
        <motion.div
          custom={idx}
          initial="hidden"
          animate="show"
          variants={variants}
          onHoverStart={() => setHoveredCardIdx(Option.Some(idx))}
          onHoverEnd={() => setHoveredCardIdx(Option.None())}
          className="-ml-card-x-overlap"
          key={card}
          onClick={() => {
            setHoveredCardIdx(Option.None());
            send({ type: "PLAY_CARD", index: idx });
          }}
        >
          <Card card={card} />
        </motion.div>
      ))}
    </div>
  );
}

import { motion, Variants } from "framer-motion";
import { useRef, useState } from "react";
import { useSnapshot } from "valtio";
import Card, { WIDTH } from "./Card";
import { actions, store } from "./store";
import { Option, sign } from "./util";

export default function Hand() {
  const snap = useSnapshot(store);

  const overlap = WIDTH / 1.75;

  const [hoveredCardIdx, setHoveredCardIdx] = useState<Option<number>>(
    Option.None()
  );
  const hasHoveredAtLeastOnce = useRef(false);
  hasHoveredAtLeastOnce.current ||= hoveredCardIdx.isSome();

  function offsetFromCentered(index: number): Option<number> {
    const parentIdx = Math.floor(snap.game.me.hand.length / 2);
    const nonPlayedCurrentCardIdx = snap.game.me.hand.findIndex(
      (card) => card === snap.game.me.hand[index]
    );
    const hasBeenPlayed = nonPlayedCurrentCardIdx === -1;
    if (hasBeenPlayed) return Option.None();
    return Option.Some(nonPlayedCurrentCardIdx - parentIdx);
  }

  function offsetFromHovered(index: number): Option<number> {
    return hoveredCardIdx
      .map((i) => {
        const hoveredCardInNonPlayedCardsIdx = snap.game.me.hand.findIndex(
          (card) => card === snap.game.me.hand[i]
        );
        const nonPlayedCurrentCardIdx = snap.game.me.hand.findIndex(
          (card) => card === snap.game.me.hand[index]
        );
        const hasBeenPlayed = nonPlayedCurrentCardIdx === -1;
        if (hasBeenPlayed) return Option.None<number>();
        return Option.Some(
          nonPlayedCurrentCardIdx - hoveredCardInNonPlayedCardsIdx
        );
      })
      .flatten();
  }

  const variants: Variants = {
    show: (idx: number) => ({
      x: offsetFromHovered(idx)
        .filter((i) => i === 1)
        .mapOr(0, () => overlap / 3),
      y:
        offsetFromCentered(idx)
          .map(Math.abs)
          .mapOr(0, (i) => i ** 1.75) +
        offsetFromHovered(idx)
          .map((i) => new Option([-35, -15].at(Math.abs(i))))
          .flatten()
          .unwrapOr(0),
      transition: {
        delay: hasHoveredAtLeastOnce.current
          ? 0
          : hoveredCardIdx.map(() => 0).unwrapOr(idx * 0.04),
      },
      rotate: `${
        offsetFromCentered(idx).mapOr(0, (i) => i * 1) +
        offsetFromHovered(idx)
          .map((i) =>
            new Option([0, 1.5].at(Math.abs(i))).map((val) => val * sign(i))
          )
          .flatten()
          .unwrapOr(0)
      }deg`,
      scale: offsetFromHovered(idx)
        .map((i) => new Option([1.3, 1.15].at(Math.abs(i))))
        .flatten()
        .unwrapOr(1),
    }),
    hidden: {
      y: 400,
    },
  };

  return (
    <div
      className="flex w-full flex-nowrap items-end justify-center"
      style={{ paddingLeft: overlap }}
    >
      {snap.game.me.hand.map((card, idx) => (
        <motion.div
          custom={idx}
          initial="hidden"
          animate="show"
          variants={variants}
          onHoverStart={() => setHoveredCardIdx(Option.Some(idx))}
          onHoverEnd={() => setHoveredCardIdx(Option.None())}
          style={{
            marginLeft: -overlap,
          }}
          key={card}
          onClick={() => {
            setHoveredCardIdx(Option.None());
            actions.playCard(idx);
          }}
        >
          <Card card={card} />
        </motion.div>
      ))}
    </div>
  );
}

import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import Card from "./Card";
import { Card as LibCard } from "./lib";
import { Option, sign } from "./util";

export interface HandProps {
  cards: LibCard[];
}

export default function Hand(props: HandProps) {
  const width = 165;
  const overlap = width / 1.75;

  const [hoveredCardIdx, setHoveredCardIdx] = useState<Option<number>>(
    Option.None()
  );
  const [played, setPlayed] = useState<LibCard[]>([]);
  const hasHoveredAtLeastOnce = useRef(false);
  hasHoveredAtLeastOnce.current ||= hoveredCardIdx.isSome();

  const nonPlayedCards = useMemo(
    () => props.cards.filter((card) => !played.includes(card)),
    [props.cards, played]
  );

  function offsetFromCentered(index: number): Option<number> {
    const parentIdx = Math.floor(nonPlayedCards.length / 2);
    const nonPlayedCurrentCardIdx = nonPlayedCards.findIndex(
      (card) => card === props.cards[index]
    );
    const hasBeenPlayed = nonPlayedCurrentCardIdx === -1;
    if (hasBeenPlayed) return Option.None();
    return Option.Some(nonPlayedCurrentCardIdx - parentIdx);
  }

  function offsetFromHovered(index: number): Option<number> {
    return hoveredCardIdx
      .map((i) => {
        const hoveredCardInNonPlayedCardsIdx = nonPlayedCards.findIndex(
          (card) => card === props.cards[i]
        );
        const nonPlayedCurrentCardIdx = nonPlayedCards.findIndex(
          (card) => card === props.cards[index]
        );
        const hasBeenPlayed = nonPlayedCurrentCardIdx === -1;
        if (hasBeenPlayed) return Option.None<number>();
        return Option.Some(
          nonPlayedCurrentCardIdx - hoveredCardInNonPlayedCardsIdx
        );
      })
      .flatten();
  }

  const variants = {
    played: {
      left: "50%",
      top: "50%",
      translateY: "-50%",
      y: 0,
    },
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
          : hoveredCardIdx.map(() => 0).unwrapOr(idx * 0.02),
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
      className="flex w-full flex-nowrap items-end justify-center pb-16"
      style={{ paddingLeft: overlap }}
    >
      {props.cards.map((card, idx) => (
        <motion.div
          custom={idx}
          initial="hidden"
          animate={played.includes(props.cards[idx]) ? "played" : "show"}
          variants={variants}
          onHoverStart={() =>
            !played.includes(card) && setHoveredCardIdx(Option.Some(idx))
          }
          onHoverEnd={() => setHoveredCardIdx(Option.None())}
          style={{
            marginLeft: -overlap,
            width,
            position: played.includes(card) ? "absolute" : "initial",
            zIndex: Math.max(
              played.findIndex((val) => val === card),
              0
            ),
          }}
          key={card}
          onClick={() => {
            setHoveredCardIdx(Option.None());
            setPlayed([...played, card]);
          }}
        >
          <Card card={card} />
        </motion.div>
      ))}
    </div>
  );
}

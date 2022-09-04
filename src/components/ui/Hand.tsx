import { motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Card from "./Card";
import { Cards, Card as TCard, getRank } from "../../lib";

export interface HandProps {
  hand: Cards;
  onCardClick?: (card: TCard, index: number, n?: number) => void;
  hideCards?: boolean;
  flipped?: boolean;
  grayOut?: (card: TCard, index: number) => boolean;
  enablePlaySameRanks?: boolean;
}

export default function Hand(props: HandProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [handWidth, setHandWidth] = useState(0);
  const virtualFanWidth = Math.min(handWidth, props.hand.length * 100);
  const virtualFanHeight = virtualFanWidth * 0.75;

  const hasRef = ref.current !== undefined;
  useEffect(() => {
    const onResize = () => setHandWidth(ref.current!.clientWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hasRef]);

  function sameRanksAmnt(card: TCard) {
    return props.hand.filter((hCard) => getRank(hCard) === getRank(card))
      .length;
  }

  const [selected, setSelected] = useState<TCard | null>(null);
  function onCardClick(card: TCard, i: number, n?: number) {
    if (props.grayOut?.(card, i)) return;
    if (!props.enablePlaySameRanks) {
      props.onCardClick?.(card, i);
      return;
    }

    setSelected(null);
    if (sameRanksAmnt(card) === 1) {
      props.onCardClick?.(card, i, undefined);
    } else if (n !== undefined) {
      props.onCardClick?.(card, i, n);
    } else {
      setSelected(card);
    }
  }

  function angle(i: number) {
    const factor = props.hand.length / 4;
    let x = offsetFromCenter(props.hand, i) * 0.05;
    if (props.hand.length % 2 === 0) x += 0.025;
    return x * (Math.PI / factor);
  }

  const flippedSign = props.flipped ? -1 : 1;
  const hoverPad = 20;
  const variants: Variants = {
    show: ({ i, isSelected }: { i: number; isSelected: boolean }) => ({
      y:
        (isSelected ? -Math.cos(angle(i)) * hoverPad : 0) +
        virtualFanHeight * (1 - Math.cos(angle(i))) * flippedSign,
      x:
        (isSelected ? Math.sin(angle(i)) * hoverPad : 0) +
        virtualFanWidth * Math.sin(angle(i)),
      rotate: `${angle(i) * flippedSign}rad`,
    }),
    hidden: {
      transition: { duration: 0.2 },
      y: 300 * flippedSign,
    },
  };

  return (
    <div
      ref={ref}
      className="flex h-full max-h-card-height w-full justify-center"
    >
      {props.hand.map((card, i) => (
        <motion.div
          custom={{ i, isSelected: selected === card }}
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={variants}
          className="absolute"
          key={card}
          transition={{ type: "tween" }}
          style={{
            transformOrigin: props.flipped ? "center top" : "center bottom",
          }}
        >
          <Card
            withSelector={selected === card}
            selectorMax={sameRanksAmnt(card)}
            card={card}
            onClick={(_, n) => onCardClick(card, i, n)}
            flipped={props.hideCards}
            grayOut={props.grayOut?.(card, i)}
          />
        </motion.div>
      ))}
    </div>
  );
}

function offsetFromCenter<T>(array: T[], index: number): number {
  return index - Math.floor(array.length / 2);
}

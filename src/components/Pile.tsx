import { useSelector } from "@xstate/react";
import { AnimatePresence, motion, TargetAndTransition } from "framer-motion";
import { useContext } from "react";
import { getRank, Rank, Card as TCard } from "../lib";
import Card from "./ui/Card";
import CardHolder from "./ui/CardHolder";
import Count from "./ui/Count";
import { GlobalStateContext } from "./providers/GlobalStateProvider";

export default function Pile() {
  const { zhitheadService } = useContext(GlobalStateContext);
  const pile = useSelector(zhitheadService, (state) => state.context.pile);
  const { send } = zhitheadService;

  function animate(card: TCard): TargetAndTransition {
    const is8 = getRank(card) === Rank.Num8;
    const firstNon8AfterCard = pile
      .slice(pile.indexOf(card)! + 1)
      .find((card) => getRank(card) !== Rank.Num8);
    const shouldAnimate = is8 && firstNon8AfterCard === undefined;

    return {
      x: shouldAnimate ? 25 : 0,
      y: shouldAnimate ? 20 : 0,
      transition: {
        delay: shouldAnimate ? 0.6 : 0.1,
        type: "tween",
      },
    };
  }

  return (
    <CardHolder>
      {pile.map((card, i) => (
        <motion.div
          className="absolute"
          key={i}
          onClick={() => send({ type: "TAKE_PILE" })}
          style={{ zIndex: i + 1 }}
          animate={animate(card)}
        >
          <Card card={card} />
        </motion.div>
      ))}
      <Count count={pile.length} position="top-left" z={99} />
      <AnimatePresence>{!pile.length && <Text />}</AnimatePresence>
    </CardHolder>
  );
}

function Text() {
  return (
    <motion.div
      className="absolute flex h-full w-full items-center justify-center"
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      <span className="select-none text-xl font-semibold tracking-wide text-zinc-600 md:text-4xl md:font-bold md:tracking-wider">
        PILE
      </span>
    </motion.div>
  );
}

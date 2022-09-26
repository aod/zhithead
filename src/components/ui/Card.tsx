import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Card as TCard, getRank, getSuite, Rank, Suite } from "../../lib";

export interface CardProps {
  card?: TCard;
  flipped?: boolean;
  onClick?: (card?: TCard, n?: number) => void;
  z?: number;
  grayOut?: boolean;
  withSelector?: boolean;
  selectorMax?: number;
  noShadow?: boolean;
}

export default function Card(props: CardProps) {
  const isFace = !props.flipped && props.card !== undefined;
  const src = isFace ? createCardSVGPath(props.card!) : CARD_BACK_SVG_PATH;

  return (
    <div
      className="relative h-card-height w-card-width"
      style={{ zIndex: props.z ?? "unset" }}
    >
      <AnimatePresence>
        {props.withSelector && (
          <Selector
            onClick={(n) => props.onClick?.(props.card, n)}
            selectorMax={props.selectorMax ?? 4}
          />
        )}
      </AnimatePresence>

      <motion.img
        onClick={() => props.onClick?.(props.card)}
        layoutId={props.card?.toString()}
        animate={{
          filter: props.grayOut ? "contrast(0.55)" : "contrast(1)",
          transition: {
            duration: 1.5,
          },
        }}
        className={clsx(
          "select-none",
          !props.noShadow && "shadow-lg shadow-zinc-500/40 drop-shadow-xl",
          isFace && "rounded-lg border-white bg-white p-1",
          props.withSelector && "rounded-t-none rounded-b-lg bg-white"
        )}
        src={src}
      />
    </div>
  );
}

function Selector(props: {
  onClick: (n: number) => void;
  selectorMax: number;
}) {
  return (
    <motion.div
      className="absolute -top-5 flex h-5 w-full justify-evenly divide-x divide-white rounded-t-lg bg-black md:-top-8 md:h-8"
      initial={{ y: 32 }}
      animate={{ y: 0 }}
      exit={{ y: 32 }}
      transition={{ type: "tween", duration: 0.2 }}
    >
      {[1, 2, 3, 4].map((n, i) => (
        <button
          onClick={() => props.onClick?.(n)}
          key={i}
          className={clsx(
            "w-full text-xs text-zinc-200 md:text-base",
            n > props.selectorMax && "text-zinc-500"
          )}
          disabled={n > props.selectorMax}
        >
          {n}
        </button>
      ))}
    </motion.div>
  );
}

const CARDS_PREFIX_PATH = "/cards/";
const CARD_BACK_SVG_PATH = `${CARDS_PREFIX_PATH}BACK.svg`;

function createCardSVGPath(card: TCard) {
  return (
    CARDS_PREFIX_PATH +
    SuitePathCompLUT[getSuite(card)] +
    "-" +
    RankPathCompLUT[getRank(card)] +
    ".svg"
  );
}

const SuitePathCompLUT: Record<Suite, string> = {
  [Suite.Clubs]: "CLUB",
  [Suite.Diamonds]: "DIAMOND",
  [Suite.Hearts]: "HEART",
  [Suite.Spades]: "SPADE",
};

const RankPathCompLUT: Record<Rank, string> = {
  [Rank.Ace]: "1",
  [Rank.Num2]: "2",
  [Rank.Num3]: "3",
  [Rank.Num4]: "4",
  [Rank.Num5]: "5",
  [Rank.Num6]: "6",
  [Rank.Num7]: "7",
  [Rank.Num8]: "8",
  [Rank.Num9]: "9",
  [Rank.Num10]: "10",
  [Rank.Jack]: "11-JACK",
  [Rank.Queen]: "12-QUEEN",
  [Rank.King]: "13-KING",
};

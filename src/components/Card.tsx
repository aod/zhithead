import clsx from "clsx";
import { motion } from "framer-motion";
import { Card as TCard, getRank, getSuite, Rank, Suite } from "../lib";

export interface CardProps {
  card?: TCard;
  flipped?: boolean;
  onClick?: (card: TCard | undefined) => void;
  z?: number;
  grayOut?: boolean;
}

export default function Card(props: CardProps) {
  const isFace = !props.flipped && props.card !== undefined;
  const src = isFace ? createCardSVGPath(props.card!) : CARD_BACK_SVG_PATH;

  return (
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
        "relative h-card-height w-card-width select-none shadow-lg shadow-zinc-500/40 drop-shadow-xl",
        isFace && "rounded-xl border-white bg-white p-1"
      )}
      src={src}
      style={{ zIndex: props.z ?? "unset" }}
    />
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

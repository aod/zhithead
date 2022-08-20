import { motion } from "framer-motion";
import { Card as TCard, getRank, getSuite, Rank, Suite } from "../lib";

export interface CardProps {
  card?: TCard;
  flipped?: boolean;
  onClick?: (card: TCard | undefined) => void;
  z?: number;
}

export default function Card(props: CardProps) {
  const src =
    props.flipped || props.card === undefined
      ? CARD_BACK_SVG_PATH
      : createCardSVGPath(props.card);

  return (
    <motion.img
      onClick={() => props.onClick?.(props.card)}
      layoutId={props.card?.toString()}
      className="
        max-w-card-width relative h-full max-h-card-height w-full select-none rounded-lg bg-white p-1 shadow-lg shadow-zinc-500/40 drop-shadow-xl"
      src={src}
      style={{ zIndex: props.z ?? 0 }}
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

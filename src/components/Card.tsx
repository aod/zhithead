import clsx from "clsx";
import { motion } from "framer-motion";
import { Card as LibCard, getRank, getSuite, Rank, Suite } from "../lib";

function createCardSVGPath(card: LibCard) {
  const suitePathComponent = Suite[getSuite(card)].toUpperCase().slice(0, -1);
  const r = getRank(card);
  const rankPathComponent = `${r + 1}${
    r >= Rank.Jack ? `-${Rank[r].toUpperCase()}` : ""
  }`;
  return `/cards/${suitePathComponent}-${rankPathComponent}.svg`;
}

export interface CardProps {
  card?: LibCard;
  flipped?: boolean;
}

export default function Card(props: CardProps) {
  const src =
    props.flipped || props.card === undefined
      ? "/cards/BACK.svg"
      : createCardSVGPath(props.card);

  return (
    <motion.img
      layoutId={props.card?.toString()}
      className={clsx(
        `relative h-card-height w-card-width select-none rounded-lg bg-white p-1 shadow-lg shadow-zinc-500/40 drop-shadow-xl`,
        props.card !== undefined && "z-10"
      )}
      src={src}
    />
  );
}

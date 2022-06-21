import { Card as LibCard, getRank, getSuite, Rank, Suite } from "./lib";

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
    <div className="relative select-none rounded-2xl bg-zinc-600">
      <div className="absolute h-full w-full" />
      <img src={src} className="p-2" />
    </div>
  );
}

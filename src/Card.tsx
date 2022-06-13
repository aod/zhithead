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
  card: LibCard;
}

export default function Card(props: CardProps) {
  return (
    <div className="select-none rounded-2xl bg-zinc-600 p-2.5">
      <img src={createCardSVGPath(props.card)} className="w-[200px]" />
    </div>
  );
}

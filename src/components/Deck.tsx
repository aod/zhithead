import clsx from "clsx";

import * as selectors from "../state/selectors";
import { GlobalStateContext } from "./providers/GlobalStateProvider";

import Card from "./ui/Card";
import CardHolder from "./ui/CardHolder";
import Count from "./ui/Count";

export default function Deck() {
  const deck = GlobalStateContext.useSelector(selectors.getDeck);
  const hasDeck = Boolean(deck.length);

  return (
    <CardHolder>
      {hasDeck && <Card key={deck.length} card={deck.at(-1)} flipped />}
      <Count count={deck.length} position="top-left" />
      <Text withBg={hasDeck} />
    </CardHolder>
  );
}

function Text(props: { withBg: boolean }) {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
      <span
        className={clsx(
          "select-none rounded-lg text-xl font-semibold tracking-wide md:text-4xl md:font-bold md:tracking-wider",
          props.withBg && "bg-zinc-800/40 p-2 text-zinc-200",
          !props.withBg && "text-zinc-600"
        )}
      >
        DECK
      </span>
    </div>
  );
}

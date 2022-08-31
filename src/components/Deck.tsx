import { useSelector } from "@xstate/react";
import clsx from "clsx";
import { useContext } from "react";
import Card from "./ui/Card";
import CardHolder from "./ui/CardHolder";
import Count from "./ui/Count";
import { GlobalStateContext } from "./providers/GlobalStateProvider";

export default function Deck() {
  const globalServices = useContext(GlobalStateContext);
  const deck = useSelector(
    globalServices.zhitheadService,
    (state) => state.context.deck
  );
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

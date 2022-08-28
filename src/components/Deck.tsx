import { useSelector } from "@xstate/react";
import clsx from "clsx";
import { useContext } from "react";
import Card from "./Card";
import Count from "./Count";
import { GlobalStateContext } from "./GlobalStateProvider";

export default function Deck() {
  const globalServices = useContext(GlobalStateContext);
  const deck = useSelector(
    globalServices.zhitheadService,
    (state) => state.context.deck
  );
  const { send } = globalServices.zhitheadService;
  const hasDeck = Boolean(deck.length);

  return (
    <div
      className="relative box-content h-card-height w-card-width rounded-xl border-2 border-dashed border-zinc-600 p-0.5"
      onClick={() => {
        send({ type: "TAKE_CARD" });
      }}
    >
      {hasDeck && <Card key={deck.length} card={deck.at(-1)} flipped />}
      <Count count={deck.length} position="top-left" />
      <Text withBg={hasDeck} />
    </div>
  );
}

function Text(props: { withBg: boolean }) {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
      <span
        className={clsx(
          "select-none rounded-lg  text-4xl font-bold tracking-wider",
          props.withBg && "bg-zinc-800/40 p-2 text-zinc-200",
          !props.withBg && "text-zinc-600"
        )}
      >
        DECK
      </span>
    </div>
  );
}

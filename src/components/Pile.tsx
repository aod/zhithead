import { useSelector } from "@xstate/react";
import { useContext } from "react";
import Card from "./Card";
import Count from "./Count";
import { GlobalStateContext } from "./GlobalStateProvider";

export default function Pile() {
  const { zhitheadService } = useContext(GlobalStateContext);
  const pile = useSelector(zhitheadService, (state) => state.context.pile);

  return (
    <div className="relative box-content flex h-card-height w-card-width justify-center rounded-xl border-2 border-dashed border-zinc-600 p-0.5">
      <Count count={pile.length} position="left" />
      {pile.length >= 1 && <Card key={pile.length} card={pile.at(-1)} />}
      {pile.length >= 2 && (
        <div className="absolute z-[1]">
          <Card card={pile.at(-2)} />
        </div>
      )}
      <div className="absolute z-0 flex h-full w-full items-center justify-center">
        <span className="select-none text-4xl font-bold tracking-wider text-zinc-600">
          PILE
        </span>
      </div>
    </div>
  );
}

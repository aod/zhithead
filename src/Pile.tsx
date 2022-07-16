import { useActor } from "@xstate/react";
import { useContext } from "react";
import Card from "./Card";
import { GlobalStateContext } from "./GlobalStateProvider";

export default function Pile() {
  const globalServices = useContext(GlobalStateContext);
  const [state] = useActor(globalServices.zhitheadService);

  return (
    <div className="flex justify-center">
      {state.context.pile.length ? (
        <Card card={state.context.pile.at(-1)} />
      ) : (
        <EmptyPile />
      )}
    </div>
  );
}

function EmptyPile() {
  return (
    <div className="relative aspect-auto rounded-xl border-4 border-dashed border-zinc-600">
      <div className="invisible">
        <Card flipped />
      </div>
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
        <span className="select-none text-4xl font-bold tracking-wider text-zinc-600">
          PILE
        </span>
      </div>
    </div>
  );
}

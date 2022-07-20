import { useActor } from "@xstate/react";
import { useContext } from "react";
import Card from "./Card";
import { GlobalStateContext } from "./GlobalStateProvider";

export default function Pile() {
  const globalServices = useContext(GlobalStateContext);
  const [state] = useActor(globalServices.zhitheadService);

  return (
    <div className="relative box-content flex h-card-height w-card-width justify-center rounded-xl border-2 border-dashed border-zinc-600 p-0.5">
      {state.context.pile.length >= 1 && (
        <Card
          key={state.context.pile.length}
          card={state.context.pile.at(-1)}
        />
      )}
      {state.context.pile.length >= 2 && (
        <div className="absolute z-[1]">
          <Card card={state.context.pile.at(-2)} />
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

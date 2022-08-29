import { createContext, PropsWithChildren } from "react";
import { useInterpret } from "@xstate/react";
import { zhitheadMachine } from "../../state/machines/zhithead.machine";
import { InterpreterFrom } from "xstate";

export const GlobalStateContext = createContext({
  zhitheadService: {} as InterpreterFrom<typeof zhitheadMachine>,
});

export default function GlobalStateProvider(props: PropsWithChildren) {
  const zhitheadService = useInterpret(zhitheadMachine);

  return (
    <GlobalStateContext.Provider value={{ zhitheadService }}>
      {props.children}
    </GlobalStateContext.Provider>
  );
}

import { createActorContext } from "@xstate/react";
import { createBrowserInspector } from "@statelyai/inspect";

import { zhitheadMachine } from "../../state/machines/zhithead.machine";

declare global {
  interface Window {
    inspector: ReturnType<typeof createBrowserInspector> | undefined;
  }
}

const inspector = createBrowserInspector({
  autoStart: false,
});
window.inspector = inspector;

export const GlobalStateContext = createActorContext(zhitheadMachine, {
  inspect: inspector.inspect,
});

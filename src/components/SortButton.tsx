import { motion } from "framer-motion";
import { SortAsc } from "lucide-react";

import * as selectors from "../state/selectors";
import { GlobalStateContext } from "./providers/GlobalStateProvider";

export default function SortButton() {
  const { send } = GlobalStateContext.useActorRef();
  const hand = GlobalStateContext.useSelector(selectors.getPlayerHand("human"));

  return (
    <motion.button
      onClick={() => send({ type: "SORT_HAND" })}
      className="flex items-center justify-center rounded-full bg-black p-1.5 sm:p-2"
      title="Sort your hand"
      initial={{ y: 100 }}
      animate={{ y: !hand.length ? 100 : 0 }}
      exit={{ y: 100 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    >
      <SortAsc className="h-4 w-4 -rotate-90 stroke-zinc-200 sm:h-6 sm:w-6" />
    </motion.button>
  );
}

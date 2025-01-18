import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { History as HistoryIcon } from "lucide-react";

import { GlobalStateContext } from "./providers/GlobalStateProvider";
import * as selectors from "../state/selectors";

export default function History() {
  const [hovering, setHovering] = useState<number | null>(null);
  const history = GlobalStateContext.useSelector(selectors.getHistory);

  const size = 10;
  const rowHeight = 20;

  return (
    <div>
      <AnimatePresence>
        {history.slice(0, size).map((state, i) => (
          <motion.div
            //
            className="absolute origin-top-left cursor-pointer text-sm text-zinc-200 text-opacity-70"
            key={state}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y:
                i * rowHeight +
                (hovering !== null && hovering !== i
                  ? i > hovering
                    ? 45
                    : -20
                  : 0),
              opacity: 1 - i * (1 / size),
            }}
            whileHover={{ fontSize: "50px" }}
            onHoverStart={() => setHovering(i)}
            onHoverEnd={() => setHovering(null)}
          >
            {state}
            <AnimatePresence>
              {hovering === i && (
                <motion.div
                  className="absolute top-9 flex items-center gap-1"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.span
                    initial={{
                      rotate: 180,
                    }}
                    animate={{
                      rotate: 360,
                      transition: { delay: 0.1 },
                    }}
                  >
                    <HistoryIcon className="h-6 w-6" />
                  </motion.span>
                  <span className="text-sm">
                    Revert{" "}
                    {i === 0
                      ? "to previous"
                      : `${i} turn${i > 1 ? "s" : ""} back to `}{" "}
                    turn {history.length - i}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

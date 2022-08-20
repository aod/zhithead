import { useSelector } from "@xstate/react";
import { motion } from "framer-motion";
import { useContext } from "react";
import Card from "./Card";
import { GlobalStateContext } from "./GlobalStateProvider";

export default function OffHand() {
  const globalServices = useContext(GlobalStateContext);
  const offHand = useSelector(
    globalServices.zhitheadService,
    (state) => state.context.human.offHand
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center gap-2"
    >
      {[0, 1, 2].map((index) => (
        <div key={offHand.faceUp[index] ?? `i${index}`}>
          <div className="relative h-card-height w-card-width">
            <div className="absolute left-0 top-0">
              <Card flipped />
            </div>
            {offHand.faceUp[index] !== undefined && (
              <div className="absolute left-0 top-0">
                <Card card={offHand.faceUp[index]} z={10} />
              </div>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

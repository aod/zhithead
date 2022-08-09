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
            {offHand.faceUp[index] !== undefined && (
              <Card card={offHand.faceUp[index]} />
            )}
            <div className="absolute top-0">
              <Card flipped />
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

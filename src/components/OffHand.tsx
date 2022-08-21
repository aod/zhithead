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
      initial={{ y: 300 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2, type: "tween" }}
      exit={{ y: 300 }}
      className="space-x-4"
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="relative inline-block h-card-height w-card-width"
        >
          <div className="absolute left-0 top-0">
            <Card flipped />
          </div>
          {offHand.faceUp[index] !== undefined && (
            <div className="absolute left-0 top-0">
              <Card card={offHand.faceUp[index]} z={1} />
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Player } from "../lib";
import Card from "./Card";

export interface OffHandViewProps {
  offHand: Player["offHand"];
  flipped?: boolean;
}

export default function OffHandView(props: OffHandViewProps) {
  const flippedSign = props.flipped ? -1 : 1;

  return (
    <motion.div
      initial={{ y: 300 * flippedSign }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2, type: "tween" }}
      exit={{ y: 300 * flippedSign }}
      className="flex justify-center space-x-4"
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="relative inline-block h-card-height w-card-width"
        >
          <div className="absolute left-0 top-0">
            <Card flipped />
          </div>
          {props.offHand.faceUp[index] !== undefined && (
            <div className="absolute left-0 top-0">
              <Card card={props.offHand.faceUp[index]} z={1} />
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Card as TCard, Player } from "../../lib";
import Card from "./Card";
import CardHolder from "../CardHolder";

type Position = 0 | 1 | 2;

export interface OffHandProps {
  offHand: Player["offHand"];
  flipped?: boolean;
  onCardPositionedClick?: (card: TCard, position: Position) => void;
  grayOutFaceUpCard?: (card: TCard, position: Position) => boolean;
}

export default function OffHand(props: OffHandProps) {
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
        <CardHolder key={index}>
          {props.offHand.faceDown[index] !== undefined && (
            <div className="absolute">
              <Card
                flipped
                card={props.offHand.faceDown[index]}
                onClick={(card) =>
                  props.onCardPositionedClick?.(card!, index as Position)
                }
              />
            </div>
          )}
          {props.offHand.faceUp[index] !== undefined && (
            <div className="absolute">
              <Card
                card={props.offHand.faceUp[index]}
                z={1}
                onClick={() =>
                  props.onCardPositionedClick?.(
                    props.offHand.faceUp[index]!,
                    index as Position
                  )
                }
                grayOut={props.grayOutFaceUpCard?.(
                  props.offHand.faceUp[index]!,
                  index as Position
                )}
              />
            </div>
          )}
        </CardHolder>
      ))}
    </motion.div>
  );
}

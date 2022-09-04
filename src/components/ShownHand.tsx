import { useSelector } from "@xstate/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { canPlay } from "../lib";
import { Player } from "../state/machines/zhithead.machine";
import { isChoosingFaceUpCardsStor, isPlayingStor } from "../state/selectors";
import { GlobalStateContext } from "./providers/GlobalStateProvider";
import Hand from "./ui/Hand";
import OffHand from "./ui/OffHand";

interface ShownHandProps {
  player: Player;
}

export default function ShownHand(props: ShownHandProps) {
  const { zhitheadService } = useContext(GlobalStateContext);
  const isPlaying = useSelector(zhitheadService, isPlayingStor);
  const isChoosingFaceUpCards = useSelector(
    zhitheadService,
    isChoosingFaceUpCardsStor
  );

  const shownHand = useSelector(
    zhitheadService,
    (state) => state.context.shownHand[props.player]
  );
  const hand = useSelector(
    zhitheadService,
    (state) => state.context[props.player].hand
  );
  const offHand = useSelector(
    zhitheadService,
    (state) => state.context[props.player].offHand
  );
  const pile = useSelector(zhitheadService, (state) => state.context.pile);

  // TODO: Is this the correct way to access services?
  const human = useSelector(zhitheadService, (state) => state.children.human);
  const { send } = human;

  const flipped = props.player === "bot";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={shownHand}
        className={clsx(
          "absolute h-card-height w-full",
          shownHand === "hand" && (flipped ? "-top-5" : "-bottom-2.5"),
          shownHand === "offhand" && (flipped ? "top-20" : "bottom-20")
        )}
      >
        {shownHand === "hand" && (
          <Hand
            enablePlaySameRanks={props.player === "human" && isPlaying}
            hand={hand}
            onCardClick={(card, _, n) => {
              if (props.player === "human") {
                send({ type: "CHOOSE_CARD", card, n });
              }
            }}
            grayOut={
              props.player === "bot"
                ? undefined
                : (card) => !canPlay(card, pile)
            }
            flipped={flipped}
            hideCards={props.player === "bot"}
          />
        )}
        {shownHand === "offhand" && (
          <OffHand
            disable={props.player === "human" && isChoosingFaceUpCards}
            flipped={flipped}
            offHand={offHand}
            onCardPositionedClick={(card, _, n) => {
              if (props.player === "human") {
                send({ type: "CHOOSE_CARD", card, n });
              }
            }}
            grayOutFaceUpCard={(card) => !!hand.length || !canPlay(card, pile)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

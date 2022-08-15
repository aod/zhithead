import HumanHand from "../HumanHand";
import OffHand from "../OffHand";

export default function ChoosingFaceUpCards() {
  return (
    <div className="flex h-full flex-col justify-center gap-20">
      <OffHand />
      <HumanHand />
    </div>
  );
}

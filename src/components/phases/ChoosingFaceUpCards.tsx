import Hand from "../Hand";
import OffHand from "../OffHand";

export default function ChoosingFaceUpCards() {
  return (
    <div className="flex h-full flex-col justify-end gap-8 pb-10">
      <OffHand />
      <Hand />
    </div>
  );
}

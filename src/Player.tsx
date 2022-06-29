import Hand from "./Hand";
import OffHand from "./OffHand";

export default function Player() {
  return (
    <div className="flex flex-col gap-8">
      <OffHand />
      <Hand />
    </div>
  );
}

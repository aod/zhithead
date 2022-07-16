import Pile from "../Pile";
import Switcher from "../Switcher";
import ShownHand from "../ShownHand";

export default function Playing() {
  return (
    <div className="flex h-full flex-col justify-end gap-8 pb-10">
      <Pile />
      <ShownHand />
      <Switcher />
    </div>
  );
}

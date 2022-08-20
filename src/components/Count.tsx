import clsx from "clsx";

interface CountProps {
  count: number;
  position: "left" | "right";
  z?: number;
}

export default function Count(props: CountProps) {
  return (
    <div
      className={clsx(
        "absolute flex h-8 w-8 items-center justify-center rounded-full bg-black p-2 text-xs text-zinc-200",
        props.position === "left" && "-left-4 -top-4",
        props.position === "right" && "-right-4 -top-4"
      )}
      style={{ zIndex: props.z ?? 0 }}
    >
      {props.count}
    </div>
  );
}

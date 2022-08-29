import clsx from "clsx";

interface CountProps {
  count: number;
  position: `${"top" | "bottom"}-${"left" | "right"}`;
  z?: number;
}

export default function Count(props: CountProps) {
  return (
    <div
      className={clsx(
        "absolute flex h-8 w-8 items-center justify-center rounded-full bg-black p-2 text-xs text-zinc-200",
        props.position === "top-left" && "-left-4 -top-4",
        props.position === "top-right" && "-right-4 -top-4",
        props.position === "bottom-left" && "-left-4 -bottom-4",
        props.position === "bottom-right" && "-right-4 -bottom-4"
      )}
      style={{ zIndex: props.z ?? "unset" }}
    >
      {props.count}
    </div>
  );
}

import { PropsWithChildren } from "react";

export default function CardHolder(props: PropsWithChildren) {
  return (
    <div className="relative flex h-card-height w-card-width items-center justify-center rounded-lg outline-dashed outline-1 outline-offset-2 outline-zinc-400 md:outline-2">
      {props.children}
    </div>
  );
}

import Hand from "./Hand";
import { createCard, Rank, Suite } from "./lib";

export default function App() {
  const cards = [
    createCard(Suite.Clubs, Rank.Num6),
    createCard(Suite.Clubs, Rank.Num9),
    createCard(Suite.Diamonds, Rank.Num2),
    createCard(Suite.Diamonds, Rank.Ace),
    createCard(Suite.Hearts, Rank.Queen),
    createCard(Suite.Hearts, Rank.King),
    createCard(Suite.Hearts, Rank.Jack),
    createCard(Suite.Hearts, Rank.Ace),
    createCard(Suite.Hearts, Rank.Num4),
    createCard(Suite.Hearts, Rank.Num2),
    createCard(Suite.Hearts, Rank.Num6),
    createCard(Suite.Hearts, Rank.Num9),
  ];

  return (
    <main className="flex h-screen items-end justify-center overflow-hidden bg-zinc-800">
      <Hand cards={cards} />
    </main>
  );
}

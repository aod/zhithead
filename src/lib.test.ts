import { expect, test } from "vitest";
import {
  createCard,
  createDeck,
  decodeCard,
  displayCard,
  encodeCard,
  getRank,
  getSuite,
  Rank,
  Suite,
} from "./lib";

test("getSuite()", () => {
  expect(getSuite(createCard(Suite.Clubs, Rank.Ace))).toBe(Suite.Clubs);
  expect(getSuite(createCard(Suite.Diamonds, Rank.Queen))).toBe(Suite.Diamonds);
  expect(getSuite(createCard(Suite.Hearts, Rank.King))).toBe(Suite.Hearts);
  expect(getSuite(createCard(Suite.Spades, Rank.Ace))).toBe(Suite.Spades);
});

test("getRank()", () => {
  expect(getRank(createCard(Suite.Clubs, Rank.Ace))).toBe(Rank.Ace);
  expect(getRank(createCard(Suite.Clubs, Rank.Num2))).toBe(Rank.Num2);
  expect(getRank(createCard(Suite.Diamonds, Rank.Jack))).toBe(Rank.Jack);
  expect(getRank(createCard(Suite.Hearts, Rank.King))).toBe(Rank.King);
  expect(getRank(createCard(Suite.Spades, Rank.Num10))).toBe(Rank.Num10);
});

test("displayCard()", () => {
  expect(displayCard(createCard(Suite.Clubs, Rank.Num2))).toBe("2C");
  expect(displayCard(createCard(Suite.Clubs, Rank.Num3))).toBe("3C");
  expect(displayCard(createCard(Suite.Clubs, Rank.Num4))).toBe("4C");
  expect(displayCard(createCard(Suite.Clubs, Rank.Num5))).toBe("5C");
  expect(displayCard(createCard(Suite.Clubs, Rank.Num6))).toBe("6C");
  expect(displayCard(createCard(Suite.Clubs, Rank.Num7))).toBe("7C");
  expect(displayCard(createCard(Suite.Clubs, Rank.Num8))).toBe("8C");
  expect(displayCard(createCard(Suite.Clubs, Rank.Num9))).toBe("9C");
  expect(displayCard(createCard(Suite.Clubs, Rank.Num10))).toBe("10C");
  expect(displayCard(createCard(Suite.Clubs, Rank.Jack))).toBe("JC");
  expect(displayCard(createCard(Suite.Clubs, Rank.Queen))).toBe("QC");
  expect(displayCard(createCard(Suite.Clubs, Rank.King))).toBe("KC");
  expect(displayCard(createCard(Suite.Clubs, Rank.Ace))).toBe("AC");
});

test("type Card codec", () => {
  const deck = createDeck();
  const encodedDeck = deck.map(encodeCard);
  const decodedDeck = encodedDeck.map(decodeCard);
  expect(decodedDeck).toStrictEqual(deck);
});

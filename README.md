[shithead]: https://en.wikipedia.org/wiki/Shithead_(card_game)
[zhithead]: https://zhithead.yatko.dev

<p align="center">
  <a href="https://zhithead.yatko.dev">
    <img src="public/logo/zhithead.svg" height="210">
    <h1 align="center"><b>Zhithead</b></h1>
  </a>
</p>

[Rules](#rules)
| [Background and motivation](#background-and-motivation)
| [Roadmap](#roadmap)
| [Development](#development)
| [Contributing](#contributing)
| [License](#license)

![GitHub](https://img.shields.io/github/license/aod/zhithead?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/aod/zhithead?style=flat-square)
![GitHub Repo stars](https://img.shields.io/github/stars/aod/zhithead?style=social)

---

_**Disclaimer: Zhithead is currently a work in progress!**_

---

Zhithead is a clone of the original card game [shithead][shithead] made for
the browser.

> Shithead (also known by many other names, most commonly Karma, Palace and
> Shed) is a card game, the object of which is to lose all of one's playing
> cards, with the final player being the "shthead".

Here's a preview:

<p align="center">
    <img src=".readme/preview.gif" height="600" />
</p>

Playtest it [here][zhithead]!

## Rules

Of course to playtest the game you need to know the rules. Well, here they are:

- From a standard shuffled deck each player is dealt:
  - 3 **hand** cards
  - 3 **face-up** cards
  - 3 **face-down** (blind) cards
- At the beginning players place 3 cards from their **hand** as their **face-up**
  cards
- The cards are valued by **rank**:
  - From lowest to highest value: 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
  - Played cards must be of equal or higher value
  - 2, 7, 8 and 10 are special:
    - 2: Can be played on anything
    - 7: Any following card must be of equal or lesser value
    - 8: Can be played on anything **and** is transparent
    - 10: Burns the pile including itself
- The game starts with the first turn being the next clockwise player of who
  dealt the cards. Further turns are taken in clockwise order
- Player does one of the following on their turn:
  - Plays 1 up to multiple cards of the same rank
  - Picks up the pile
- Player then ensures their **hand** size is atleast 3 by picking card(s)
  from the deck if necessary and is possible (deck contains cards)
- When the player's _*hand*_ is empty you move to the next one:
  **hand** -> **face-up** -> **face-down**
- **face-down** cards are played _blindly_ and player must take the pile
  onto their **hand** if its _value_ is less
- First one to play their last card wins
- Whoever wins is the next dealer

# Background and motivation

I never really got into card games until a good friend of mine introduced
me to different kinds i.e. _Toepen_, _Eenendertigen_ and _Shithead_. This
intrigued me to recreate them for in a browser. My first attempt precedes this
one which was the same card game, Shithead, but it was mainly focused on online
support to play with friends. Long story short it worked quite well but the
codebase was such a mess and it didn't look great at all. Fastforward now I'm
recreating it but with the focus on UX first and multiplayer last.

# Roadmap

As mentioned above in the disclaimer, Zhithead is still a work in progress and
is missing some features. In the following stages of development I'm planning
to implement the following features:

## Alpha

- [x] Implement missing rules
  - [x] Burn pile after 4 cards with same rank has been played
  - [x] Play multiple cards of the same rank
- [x] Pile burn animation/UX
- [x] Final win/lose page
- [x] Simple title screen with basic info (about, source code, etc.) and a start button
- [ ] Teach the player on how to play
- [ ] ...

## Beta

- [ ] Multiplayer support upto 4 players
  - [ ] Invite link
- [ ] ...

## Release

- [ ] Rule variations
- [ ] User profiles
- [ ] Matchmaking
- [ ] Leaderbords
- [ ] ...

# Development

To develop Zhithead you will first need to install
[NodeJS](https://nodejs.org/en/download/).

Next, download the source code and run the following commands in the root
directory of the project:

1. Install dependencies:
   ```
   npm install
   ```
2. Start dev environment:
   ```
   npm run dev
   ```
3. Visit [localhost:3000](http://localhost:3000) to view the application.

## Building

Running this command will typecheck, lint and output the build files to `/dist`:

```
npm run build
```

## Testing

Currently there are not a lot of tests but you can run what's there using:

```
npm test
```

## Typecheck

I like to run the following command to watch for changes and typecheck
the project:

```
npx tsc --noEmit -w
```

# Contributing

Bug reports and fixes are appreciated as well as ideas or discussions!

However, since this project is a work in progress, please refrain from making PRs
implementing features on the [roadmap](#roadmap).

Thanks for your comprehension.

# License

MIT

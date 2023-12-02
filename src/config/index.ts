export const siteConfig = {
  name: "Typournament",
  description: "A tournament platform for typing enthusiasts.",
};

export const RoundScenario = {
  WIN: 3,
  DRAW: 1,
  LOSS: 0,
};

export const rules = [
  {
    title: "Step 1: Create a Tournament",
    steps: [
      "Begin by creating a tournament and invite participants by entering their email IDs.",
    ],
  },
  {
    title: "Step 2: Tournament Structure",
    steps: [
      "Tournaments are organized in a league format.",
      "Each match within the tournament consists of 3 rounds between 2 participants.",
    ],
  },
  {
    title: "Step 3: Round 1 - Shared Typing Test",
    steps: [
      "Both participants gather.",
      "Perform a coin toss.",
      "The winner of the toss gets to decide who types first or whose device is used first.",
      "The loser gets to decide on the remaining option.",
    ],
  },
  {
    title: "Step 4: Round 2 - Switching Sides",
    steps: [
      "The winner of Round 1 automatically wins the toss for Round 2.",
      "The rules for deciding the rest remains the same.",
    ],
  },
  {
    title: "Step 5: Round 3 - Comfort Zone Typing Test",
    steps: [
      "Both participants return to their own devices.",
      "Take an individual typing test.",
    ],
  },
  {
    title: "Step 6: Score Entry",
    steps: [
      "After each round, enter the scores for both participants.",
      "Leave the rest to us.",
    ],
  },
  {
    title: "Step 7: Enjoy the Excitement!",
    steps: [
      "Sit back and let us process the results.",
      "Witness the thrill of the Typing Tournament unfold.",
    ],
  },
  {
    title: "Additional Tips:",
    steps: [
      "Ensure a fair start with coin tosses.",
      "Encourage participants to bring their A-game to each round.",
      "The application automates the scoring process, making it hassle-free for you.",
    ],
  },
];

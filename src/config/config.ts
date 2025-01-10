// config.ts
export const config = {
  MerryChristmasConfig: {
    requiredScore: 1000,
    clue: "I sit atop a mountain high, Where snowy trails and skiers fly. By Sterling's lift, I wait for thee, Warm chili and cocoa, come find me.",
    nextPage: "/NeoIsTheOne"
  },
  AstridAndOrionConfig: {
    correctWordle: "SHARE",
    correctPurpleGroup: "\“S.N.L.\” CAST MEMBERS",
    correctStrandsTheme: "A visit from Santa",
    clue: "In a lodge of timeless fame, Where luxury and skiing claim their name. Near the entrance, a sign you\’ll find, to achieve your goal, then look behind",
    nextPage: "/ElectricHigh"
  },
  ParagonConfig: {
    minesweeper: {
      gridSize: 18,
      numberOfBombs: 40,
    },
    clue: "To rise above or sink below, Press my button, and off you’ll go. I carry you with gentle care, To floors beyond, I take you there. (This was the final clue, and the final gifts were located where this lead you to)",
    nextPage: null
  },
  Game2048Config: {
    targetScore: 1023,
    clue: "On the mountain where skiers glide, A refuge waits by the snowy side. Named for a pioneer, strong and true, The attached patrol keeps watch with a panoramic view",
    nextPage: "/AstridAndOrion"
  },
  CrosswordConfig: {
    answer: "CBDEPTYSNTWTTC",
    clue: "In Snow Park Lodge, where stories unfold, A crackling warmth to fend off the cold. Climb the stairs, seek the glow, A fireplace awaits, its flames to show.",
    nextPage: "/Hapland"
  },
  HangmanConfig: {
    words: [
      "STERLING",
      "CARPENTER",
      "FLAGSTAFF",
      "EMPIRE",
      "SULTAN",
      "JORDANELLE",
      "SUCCESS",
      "SUNSET",
      "LITTLE",
      "TORCH",
      "HOMESTAKE",
      "RUBY",
      "VALLEY",
      "ONTARIO",
      "MAYFLOWER",
      "BALD",
      "SNOWSHOE",
      "QUINCY",
      "ASPEN",
      "CENTENNIAL",
      "DEERHOLLOW"
    ],
    maxWrongGuesses: 6,
    requiredWins: 3,
    clue: "In the St. Regis, where luxury gleams, By the entrance, a place of dreams. An Indian picture hangs with pride, A cabinet drawer hides something inside.",
    nextPage: "/SkiPatrol"
  },
  SudokuConfig: {
    clue: "Down below where engines hum, A hidden room, both warm and snug. The boiler stands, its heat to share, Behind the door—seek treasures there.",
    nextPage: "/Paragon"
  },
};

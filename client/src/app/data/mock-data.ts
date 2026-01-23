export type DifficultyTag = 
  | "walked in and asked" 
  | "reverse-engineered" 
  | "found an ex-employee" 
  | "took multiple attempts";

export interface Bounty {
  id: string;
  recipeName: string;
  restaurantName: string;
  restaurantId: string;
  location: string;
  cuisine: string;
  points: number;
  postedBy: string;
  postedDate: string;
  description: string;
  claimedBy?: string;
  timeRemaining?: string;
  status: 'open' | 'claimed' | 'completed';
}

export interface Recipe {
  id: string;
  recipeName: string;
  restaurantName: string;
  restaurantId: string;
  cuisine: string;
  location: string;
  huntedBy: string;
  questLog: string;
  difficulty: DifficultyTag;
  ingredients: string[];
  instructions: string[];
  verificationScore: number;
  verificationCount: number;
  submittedDate: string;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  city: string;
  cuisine: string;
  crackedRecipes: number;
  verificationRate: number;
  activeBounties: number;
  imageUrl: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  category: string;
}

export interface UserProfile {
  username: string;
  points: number;
  bountiesPosted: number;
  bountiesClaimed: number;
  recipesSubmitted: number;
  verificationsCompleted: number;
  streak: number;
  joinedDate: string;
}

export const mockBounties: Bounty[] = [
  {
    id: "1",
    recipeName: "the green sauce from tacos el gordo",
    restaurantName: "tacos el gordo",
    restaurantId: "rest-1",
    location: "san diego",
    cuisine: "mexican",
    points: 500,
    postedBy: "taco_hunter",
    postedDate: "2026-01-20",
    description: "need that incredible green salsa they have at the salsa bar. it's bright, tangy, and has a unique kick",
    status: "open"
  },
  {
    id: "2",
    recipeName: "crispy chicken sandwich secret sauce",
    restaurantName: "the coop",
    restaurantId: "rest-2",
    location: "los angeles",
    cuisine: "american",
    points: 750,
    postedBy: "sauce_master",
    postedDate: "2026-01-19",
    description: "this sauce is unlike any other chicken sandwich sauce. tangy, slightly sweet, with a hint of smoke",
    claimedBy: "recipe_detective",
    timeRemaining: "3 days",
    status: "claimed"
  },
  {
    id: "3",
    recipeName: "garlic noodles",
    restaurantName: "thanh long",
    restaurantId: "rest-3",
    location: "san francisco",
    cuisine: "vietnamese",
    points: 1000,
    postedBy: "noodle_fanatic",
    postedDate: "2026-01-18",
    description: "the famous garlic noodles. buttery, garlicky, and addictive. i need this in my life",
    status: "open"
  },
  {
    id: "4",
    recipeName: "spicy vodka pasta sauce",
    restaurantName: "carbone",
    restaurantId: "rest-4",
    location: "new york",
    cuisine: "italian",
    points: 1200,
    postedBy: "pasta_lover",
    postedDate: "2026-01-17",
    description: "the spicy rigatoni sauce. creamy, spicy, perfect. someone please crack this",
    claimedBy: "chef_sleuth",
    timeRemaining: "1 day",
    status: "claimed"
  },
  {
    id: "5",
    recipeName: "miso butter glaze",
    restaurantName: "nobu",
    restaurantId: "rest-5",
    location: "los angeles",
    cuisine: "japanese fusion",
    points: 1500,
    postedBy: "umami_seeker",
    postedDate: "2026-01-16",
    description: "the black cod miso glaze. sweet, savory, umami bomb. willing to pay top points",
    status: "open"
  },
  {
    id: "6",
    recipeName: "everything bagel seasoning blend",
    restaurantName: "russ & daughters",
    restaurantId: "rest-6",
    location: "new york",
    cuisine: "deli",
    points: 300,
    postedBy: "bagel_boss",
    postedDate: "2026-01-22",
    description: "their specific everything blend is different from the store bought stuff. need the exact ratios",
    status: "open"
  }
];

export const mockRecipes: Recipe[] = [
  {
    id: "rec-1",
    recipeName: "pink sauce",
    restaurantName: "the halal guys",
    restaurantId: "rest-7",
    cuisine: "middle eastern",
    location: "new york",
    huntedBy: "sauce_whisperer",
    questLog: "walked in during off hours (3pm). asked the guy at the counter super nicely. he said most people don't just ask. he wrote down the basics on a napkin. tested it 4 times to get the ratios right.",
    difficulty: "walked in and asked",
    ingredients: [
      "1 cup mayo",
      "1/4 cup greek yogurt",
      "2 tbsp sriracha",
      "1 tbsp honey",
      "1/2 tsp garlic powder",
      "1/4 tsp cayenne pepper",
      "salt to taste"
    ],
    instructions: [
      "combine all ingredients in a bowl",
      "whisk until smooth and fully incorporated",
      "let sit in fridge for at least 30 minutes to let flavors meld",
      "adjust heat level with more or less sriracha to taste"
    ],
    verificationScore: 8.7,
    verificationCount: 23,
    submittedDate: "2026-01-15"
  },
  {
    id: "rec-2",
    recipeName: "secret fried chicken batter",
    restaurantName: "howlin' rays",
    restaurantId: "rest-8",
    cuisine: "american",
    location: "los angeles",
    huntedBy: "fry_master",
    questLog: "reverse-engineered over 12 attempts. bought the chicken 8 times, analyzed the coating texture and flavor. MSG was the key i was missing. also they double fry - first at 325°F then 375°F. the second fry makes it shatteringly crisp.",
    difficulty: "took multiple attempts",
    ingredients: [
      "2 cups all-purpose flour",
      "1/2 cup cornstarch",
      "2 tbsp MSG",
      "1 tbsp garlic powder",
      "1 tbsp onion powder",
      "2 tsp cayenne pepper",
      "2 tsp paprika",
      "1 tsp black pepper",
      "1 tbsp salt",
      "2 cups buttermilk"
    ],
    instructions: [
      "mix all dry ingredients in a large bowl",
      "soak chicken in buttermilk for at least 2 hours",
      "dredge chicken in flour mixture, press firmly to coat",
      "first fry at 325°F for 8 minutes",
      "rest for 2 minutes",
      "second fry at 375°F for 3-4 minutes until deep golden brown"
    ],
    verificationScore: 9.2,
    verificationCount: 45,
    submittedDate: "2026-01-10"
  },
  {
    id: "rec-3",
    recipeName: "carne asada marinade",
    restaurantName: "tacos el gordo",
    restaurantId: "rest-1",
    cuisine: "mexican",
    location: "san diego",
    huntedBy: "taco_detective",
    questLog: "found an ex-employee on reddit. he worked there for 3 years. confirmed they use pineapple juice as the acid and the key is marinating for exactly 4 hours - not more, not less. also needs to be grilled over charcoal.",
    difficulty: "found an ex-employee",
    ingredients: [
      "2 lbs flank steak",
      "1 cup pineapple juice",
      "1/4 cup lime juice",
      "1/4 cup orange juice",
      "4 cloves garlic, minced",
      "1/4 cup chopped cilantro",
      "2 tsp cumin",
      "1 tsp chili powder",
      "salt and pepper"
    ],
    instructions: [
      "combine all marinade ingredients",
      "score the steak lightly with a knife",
      "marinate for exactly 4 hours in the fridge",
      "grill over charcoal on high heat, 3-4 minutes per side",
      "let rest 5 minutes before slicing against the grain"
    ],
    verificationScore: 9.5,
    verificationCount: 67,
    submittedDate: "2026-01-05"
  }
];

export const mockRestaurants: Restaurant[] = [
  {
    id: "rest-1",
    name: "tacos el gordo",
    location: "3rd street",
    city: "san diego",
    cuisine: "mexican",
    crackedRecipes: 3,
    verificationRate: 9.2,
    activeBounties: 1,
    imageUrl: "mexican restaurant tacos"
  },
  {
    id: "rest-2",
    name: "the coop",
    location: "downtown",
    city: "los angeles",
    cuisine: "american",
    crackedRecipes: 1,
    verificationRate: 8.5,
    activeBounties: 1,
    imageUrl: "chicken sandwich restaurant"
  },
  {
    id: "rest-3",
    name: "thanh long",
    location: "outer sunset",
    city: "san francisco",
    cuisine: "vietnamese",
    crackedRecipes: 2,
    verificationRate: 8.9,
    activeBounties: 1,
    imageUrl: "vietnamese restaurant"
  },
  {
    id: "rest-4",
    name: "carbone",
    location: "greenwich village",
    city: "new york",
    cuisine: "italian",
    crackedRecipes: 0,
    verificationRate: 0,
    activeBounties: 1,
    imageUrl: "italian restaurant pasta"
  },
  {
    id: "rest-5",
    name: "nobu",
    location: "malibu",
    city: "los angeles",
    cuisine: "japanese fusion",
    crackedRecipes: 0,
    verificationRate: 0,
    activeBounties: 1,
    imageUrl: "japanese restaurant sushi"
  },
  {
    id: "rest-6",
    name: "russ & daughters",
    location: "lower east side",
    city: "new york",
    cuisine: "deli",
    crackedRecipes: 0,
    verificationRate: 0,
    activeBounties: 1,
    imageUrl: "bagel deli"
  },
  {
    id: "rest-7",
    name: "the halal guys",
    location: "53rd & 6th",
    city: "new york",
    cuisine: "middle eastern",
    crackedRecipes: 2,
    verificationRate: 8.7,
    activeBounties: 0,
    imageUrl: "halal food cart"
  },
  {
    id: "rest-8",
    name: "howlin' rays",
    location: "chinatown",
    city: "los angeles",
    cuisine: "american",
    crackedRecipes: 1,
    verificationRate: 9.2,
    activeBounties: 0,
    imageUrl: "fried chicken restaurant"
  },
  {
    id: "rest-9",
    name: "sukiyabashi jiro",
    location: "ginza",
    city: "tokyo",
    cuisine: "japanese",
    crackedRecipes: 0,
    verificationRate: 0,
    activeBounties: 0,
    imageUrl: "sushi restaurant"
  },
  {
    id: "rest-10",
    name: "pizzeria bianco",
    location: "downtown",
    city: "phoenix",
    cuisine: "italian",
    crackedRecipes: 2,
    verificationRate: 9.1,
    activeBounties: 0,
    imageUrl: "pizza restaurant"
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "sauce_whisperer", points: 12500, category: "top hunters" },
  { rank: 2, username: "recipe_detective", points: 11200, category: "top hunters" },
  { rank: 3, username: "fry_master", points: 9800, category: "top hunters" },
  { rank: 4, username: "taco_detective", points: 8900, category: "top hunters" },
  { rank: 5, username: "chef_sleuth", points: 7600, category: "top hunters" },
  { rank: 1, username: "taste_tester_pro", points: 8500, category: "top verifiers" },
  { rank: 2, username: "accuracy_expert", points: 7200, category: "top verifiers" },
  { rank: 3, username: "flavor_judge", points: 6800, category: "top verifiers" },
];

export const mockUserProfile: UserProfile = {
  username: "sauce_whisperer",
  points: 12500,
  bountiesPosted: 8,
  bountiesClaimed: 23,
  recipesSubmitted: 15,
  verificationsCompleted: 45,
  streak: 12,
  joinedDate: "2025-11-15"
};

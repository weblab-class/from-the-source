const API_URL = 'http://localhost:5001/api';

// Bounties
export async function getBounties() {
  const res = await fetch(`${API_URL}/bounties`);
  return res.json();
}

export async function createBounty(bounty: {
  dishName: string;
  restaurant: string;
  location?: string;
  description?: string;
  category?: string;
  pointReward?: number;
  postedBy?: string;
}) {
  const res = await fetch(`${API_URL}/bounties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bounty),
  });
  return res.json();
}

// Recipes
export async function getRecipes() {
  const res = await fetch(`${API_URL}/recipes`);
  return res.json();
}

// Restaurants
export async function getRestaurants() {
  const res = await fetch(`${API_URL}/restaurants`);
  return res.json();
}


const API_URL = import.meta.env.VITE_API_BASE ?? '/api';

// Bounties
export async function getBounties() {
  const res = await fetch(`${API_URL}/bounties`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
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
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'include',
    body: JSON.stringify(bounty),
  });
  return res.json();
}

// Recipes
export async function getRecipes() {
  const res = await fetch(`${API_URL}/recipes`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
  return res.json();
}

// Restaurants
export async function getRestaurants() {
  const res = await fetch(`${API_URL}/restaurants`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
  return res.json();
}

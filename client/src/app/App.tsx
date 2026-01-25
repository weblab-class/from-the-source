import { useState } from 'react';
import { useEffect } from 'react';
import { Home } from '@/app/components/home';
import { RestaurantPage } from '@/app/components/restaurant-page';
import { RestaurantsPage } from '@/app/components/restaurants-page';
import { Leaderboard } from '@/app/components/leaderboard';
import { Profile } from '@/app/components/profile';
import { SubmitRecipe } from '@/app/components/submit-recipe';
import { GoogleLogin, googleLogout, CredentialResponse } from '@react-oauth/google';

type Page = 'home' | 'restaurant' | 'restaurants' | 'leaderboard' | 'profile' | 'submit';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  const handleLogin = (res: any) => {
    console.log("Logged in to Google, now telling the server...");

    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token: res.credential }), // Send the token here!
    })
      .then((response) => response.json())
      .then((user) => {
        console.log("Server verified user:", user);
        setUserId(user._id); // This ID comes from YOUR MongoDB now!
      })
      .catch((err) => console.log("Login error:", err));
  };

  const handleLogout = () => {
    googleLogout();
    fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include" // ADD THIS HERE TOO
    })
      .then(() => {
        setUserId(null);
      });
  };

  useEffect(() => {
  fetch("http://localhost:5000/api/whoami", {
    credentials: "include", // THIS IS MANDATORY
  })
    .then((res) => res.json())
    .then((user) => {
      if (user._id) {
        setUserId(user._id);
      }
    })
    .catch((err) => console.log("Not logged in"));
}, []);

  const navigateToRestaurant = (restaurantId: string) => {
    setSelectedRestaurant(restaurantId);
    setCurrentPage('restaurant');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigateToRestaurant={navigateToRestaurant} onNavigateToSubmit={() => setCurrentPage('submit')} />;
      case 'restaurant':
        return <RestaurantPage restaurantId={selectedRestaurant} onBack={() => setCurrentPage('restaurants')} />;
      case 'restaurants':
        return <RestaurantsPage onNavigateToRestaurant={navigateToRestaurant} />;
      case 'leaderboard':
        return <Leaderboard onBack={() => setCurrentPage('home')} />;
      case 'profile':
        return <Profile onBack={() => setCurrentPage('home')} />;
      case 'submit':
        return <SubmitRecipe onBack={() => setCurrentPage('home')} />;
      default:
        return <Home onNavigateToRestaurant={navigateToRestaurant} onNavigateToSubmit={() => setCurrentPage('submit')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setCurrentPage('home')}
              className="lowercase tracking-wide hover:opacity-80 transition-opacity"
            >
              from the source
            </button>

            <nav className="flex items-center gap-6">
              <button onClick={() => setCurrentPage('home')} className="lowercase">bounties</button>
              <button onClick={() => setCurrentPage('restaurants')} className="lowercase">restaurants</button>
              <button onClick={() => setCurrentPage('leaderboard')} className="lowercase">leaderboard</button>

              {/* ONLY show profile link if logged in */}
              {userId && (
                <button onClick={() => setCurrentPage('profile')} className="lowercase">profile</button>
              )}

              {/* AUTH SECTION */}
              {userId ? (
                <button
                  onClick={handleLogout}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded lowercase"
                >
                  logout
                </button>
              ) : (
                <GoogleLogin
                  onSuccess={handleLogin}
                  onError={() => console.log("Login Failed")}
                  useOneTap
                />
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

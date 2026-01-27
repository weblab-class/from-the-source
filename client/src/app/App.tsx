import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Home } from '@/app/components/home';
import { RestaurantPage } from '@/app/components/restaurant-page';
import { RestaurantsPage } from '@/app/components/restaurants-page';
import { Leaderboard } from '@/app/components/leaderboard';
import { Profile } from '@/app/components/profile';
import { SubmitRecipe } from '@/app/components/submit-recipe';
import { MusicWidget } from '@/app/components/music-widget';

type Page = 'home' | 'restaurant' | 'restaurants' | 'leaderboard' | 'profile' | 'submit';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [userId, setUserId] = useState<any>(null);
  (window as any).myUser = userId;

  const GOOGLE_CLIENT_ID = "21919360500-851itvmeu0jn4010j0p68bt71m7a1ivc.apps.googleusercontent.com";

  // In dev, hit the local API server; on Render/prod, hit the same origin as the deployed site.
  // If you set VITE_API_BASE, set it to the ORIGIN only (e.g. "http://localhost:5001"), not ".../api".
  const API_ORIGIN =
    import.meta.env.VITE_API_BASE ??
    (import.meta.env.DEV ? "http://localhost:5001" : window.location.origin);

  useEffect(() => {
    fetch(`${API_ORIGIN}/api/whoami`, { credentials: "include" })
      .then((res) => res.json())
      .then((user) => {
        console.log("WhoAmI check returned:", user);
        if (user && user._id) {
          setUserId(user);
        } else {
          setUserId(null);
        }
      })
      .catch(err => console.error("WhoAmI fetch failed:", err));
  }, []);

  const handleLogin = (response: any) => {
    fetch(`${API_ORIGIN}/api/whoami`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((user) => {
        console.log("Logged in user:", user);
        setUserId(user);
      });
  };

  const handleLogout = () => {
    fetch(`${API_ORIGIN}/api/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then(() => setUserId(null));
  };

  const navigateToRestaurant = (restaurantId: string) => {
    setSelectedRestaurant(restaurantId);
    setCurrentPage('restaurant');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onNavigateToRestaurant={navigateToRestaurant}
            onNavigateToSubmit={() => setCurrentPage('submit')}
          />
        );
      case 'restaurant':
        return (
          <RestaurantPage
            restaurantId={selectedRestaurant}
            onBack={() => setCurrentPage('restaurants')}
          />
        );
      case 'restaurants':
        return <RestaurantsPage onNavigateToRestaurant={navigateToRestaurant} />;
      case 'leaderboard':
        return <Leaderboard onBack={() => setCurrentPage('home')} />;
      case 'profile':
        return <Profile userId={userId} onBack={() => setCurrentPage('home')} />;
      case 'submit':
        return <SubmitRecipe onBack={() => setCurrentPage('home')} />;
      default:
        return (
          <Home
            onNavigateToRestaurant={navigateToRestaurant}
            onNavigateToSubmit={() => setCurrentPage('submit')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
              <button
                onClick={() => setCurrentPage('home')}
                className="lowercase hover:opacity-80 transition-opacity"
              >
                bounties
              </button>
              <button
                onClick={() => setCurrentPage('restaurants')}
                className="lowercase hover:opacity-80 transition-opacity"
              >
                restaurants
              </button>
              <button
                onClick={() => setCurrentPage('leaderboard')}
                className="lowercase hover:opacity-80 transition-opacity"
              >
                leaderboard
              </button>
              <button
                onClick={() => setCurrentPage('profile')}
                className="lowercase hover:opacity-80 transition-opacity"
              >
                profile
              </button>

              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                {userId && userId._id ? (
                  <button onClick={handleLogout} className="lowercase">logout</button>
                ) : (
                  <GoogleLogin onSuccess={handleLogin} />
                )}
              </GoogleOAuthProvider>
            </nav>
          </div>
        </div>
      </header>

      <main>{renderPage()}</main>
      <MusicWidget src="/fts.mp3" defaultOpen={true} />

    </div>
  );
}

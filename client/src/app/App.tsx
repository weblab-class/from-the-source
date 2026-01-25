import { useState } from 'react';
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
        return <Profile onBack={() => setCurrentPage('home')} />;
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
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{renderPage()}</main>

      {/* Music widget on every page */}
      <MusicWidget src="/fts.mp3" defaultOpen={true} />
    </div>
  );
}

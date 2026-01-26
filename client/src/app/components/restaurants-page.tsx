import { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, ChefHat, Award, TrendingUp } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

type ApiRestaurantListItem = {
  _id?: string | null;
  name: string;
  location?: string | null;
  city?: string | null;
  cuisine?: string | null;
  recipesUnlocked?: number;
  activeBounties?: number;
};

interface RestaurantsPageProps {
  onNavigateToRestaurant: (restaurantIdOrName: string) => void;
}

export function RestaurantsPage({ onNavigateToRestaurant }: RestaurantsPageProps) {
  const [restaurants, setRestaurants] = useState<ApiRestaurantListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [cuisineFilter, setCuisineFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const res = await fetch('/api/restaurants');
      const json = await res.json();
      if (!cancelled) setRestaurants(json);
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cities = useMemo(() => {
    const vals = restaurants
      .map(r => (r.city ?? '').trim())
      .filter(Boolean);
    return Array.from(new Set(vals)).sort();
  }, [restaurants]);

  const filtered = useMemo(() => {
    return restaurants.filter(r => {
      const name = r.name?.toLowerCase() ?? '';
      const location = (r.location ?? '').toLowerCase();
      const city = (r.city ?? '').toLowerCase();
      const cuisine = (r.cuisine ?? '').toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || name.includes(q) || location.includes(q) || city.includes(q);

      const matchesCity = cityFilter === 'all' || (r.city ?? '') === cityFilter;
      const matchesCuisine = cuisineFilter === 'all' || cuisine === cuisineFilter;

      return matchesSearch && matchesCity && matchesCuisine;
    });
  }, [restaurants, searchQuery, cityFilter, cuisineFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12 text-center">
        <h1 className="lowercase tracking-wide mb-4">restaurants</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto lowercase">
          explore restaurants by location, browse their cracked recipes, and active bounties
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="search restaurants or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 lowercase"
            />
          </div>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-full sm:w-[200px] lowercase">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="all cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="lowercase">all cities</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city} className="lowercase">{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
            <SelectTrigger className="w-full sm:w-[200px] lowercase">
              <ChefHat className="w-4 h-4 mr-2" />
              <SelectValue placeholder="all cuisines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="lowercase">all cuisines</SelectItem>
              {/* keep your list; will only work once cuisine exists */}
              <SelectItem value="mexican" className="lowercase">mexican</SelectItem>
              <SelectItem value="italian" className="lowercase">italian</SelectItem>
              <SelectItem value="american" className="lowercase">american</SelectItem>
              <SelectItem value="vietnamese" className="lowercase">vietnamese</SelectItem>
              <SelectItem value="japanese" className="lowercase">japanese</SelectItem>
              <SelectItem value="middle eastern" className="lowercase">middle eastern</SelectItem>
              <SelectItem value="deli" className="lowercase">deli</SelectItem>
              <SelectItem value="other" className="lowercase">other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground lowercase">
          {loading ? 'loading…' : `${filtered.length} restaurant${filtered.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((r) => {
          const stableId = r._id ?? r.name; 
          const imageUrl = encodeURIComponent(`${r.name} food`);
          const cracked = r.recipesUnlocked ?? 0;
          const active = r.activeBounties ?? 0;

          return (
            <Card
              key={stableId}
              className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => onNavigateToRestaurant(stableId)}
            >
              <div className="h-48 bg-muted relative">
                <ImageWithFallback
                  src={`https://source.unsplash.com/600x400/?${imageUrl}`}
                  alt={r.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="lowercase">{r.name}</CardTitle>
                <CardDescription className="lowercase flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    {(r.location ?? '—')}{r.city ? `, ${r.city}` : ''}
                  </span>
                  <span className="flex items-center gap-2">
                    <ChefHat className="w-3 h-3" />
                    {(r.cuisine ?? '—').toLowerCase()}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-primary">{cracked}</div>
                    <div className="text-xs text-muted-foreground lowercase">recipes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-green-600">{active}</div>
                    <div className="text-xs text-muted-foreground lowercase">bounties</div>
                  </div>
                </div>

                {cracked > 0 && (
                  <Badge variant="secondary" className="w-full justify-center mt-4 lowercase">
                    <Award className="w-3 h-3 mr-1" />
                    {cracked} cracked
                  </Badge>
                )}

                {active > 0 && cracked === 0 && (
                  <Badge className="w-full justify-center mt-4 lowercase bg-green-100 text-green-800 border-green-300">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {active} active
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
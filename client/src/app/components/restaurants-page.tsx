import { useState } from 'react';
import { Search, MapPin, ChefHat, Award, TrendingUp } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { mockRestaurants } from '@/app/data/mock-data';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface RestaurantsPageProps {
  onNavigateToRestaurant: (restaurantId: string) => void;
}

export function RestaurantsPage({ onNavigateToRestaurant }: RestaurantsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [cuisineFilter, setCuisineFilter] = useState('all');

  // Get unique cities for filter
  const cities = Array.from(new Set(mockRestaurants.map(r => r.city))).sort();

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter === 'all' || restaurant.city === cityFilter;
    const matchesCuisine = cuisineFilter === 'all' || restaurant.cuisine === cuisineFilter;
    
    return matchesSearch && matchesCity && matchesCuisine;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="lowercase tracking-wide mb-4">restaurants</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto lowercase">
          explore restaurants by location, browse their cracked recipes, and active bounties
        </p>
      </div>

      {/* Search and Filters */}
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
                <SelectItem key={city} value={city} className="lowercase">
                  {city}
                </SelectItem>
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
              <SelectItem value="mexican" className="lowercase">mexican</SelectItem>
              <SelectItem value="italian" className="lowercase">italian</SelectItem>
              <SelectItem value="american" className="lowercase">american</SelectItem>
              <SelectItem value="vietnamese" className="lowercase">vietnamese</SelectItem>
              <SelectItem value="japanese fusion" className="lowercase">japanese fusion</SelectItem>
              <SelectItem value="japanese" className="lowercase">japanese</SelectItem>
              <SelectItem value="middle eastern" className="lowercase">middle eastern</SelectItem>
              <SelectItem value="deli" className="lowercase">deli</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground lowercase">
          {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <Card 
            key={restaurant.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            onClick={() => onNavigateToRestaurant(restaurant.id)}
          >
            <div className="h-48 bg-muted relative">
              <ImageWithFallback 
                src={`https://source.unsplash.com/600x400/?${restaurant.imageUrl}`}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="lowercase">{restaurant.name}</CardTitle>
              <CardDescription className="lowercase flex flex-col gap-1">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {restaurant.location}, {restaurant.city}
                </span>
                <span className="flex items-center gap-2">
                  <ChefHat className="w-3 h-3" />
                  {restaurant.cuisine}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-primary">
                    {restaurant.crackedRecipes}
                  </div>
                  <div className="text-xs text-muted-foreground lowercase">
                    recipes
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-amber-600">
                    {restaurant.verificationRate > 0 ? restaurant.verificationRate.toFixed(1) : '—'}
                  </div>
                  <div className="text-xs text-muted-foreground lowercase">
                    accuracy
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-green-600">
                    {restaurant.activeBounties}
                  </div>
                  <div className="text-xs text-muted-foreground lowercase">
                    bounties
                  </div>
                </div>
              </div>
              
              {restaurant.crackedRecipes > 0 && (
                <Badge variant="secondary" className="w-full justify-center mt-4 lowercase">
                  <Award className="w-3 h-3 mr-1" />
                  {restaurant.crackedRecipes} cracked
                </Badge>
              )}
              
              {restaurant.activeBounties > 0 && restaurant.crackedRecipes === 0 && (
                <Badge className="w-full justify-center mt-4 lowercase bg-green-100 text-green-800 border-green-300">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {restaurant.activeBounties} active
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="lowercase text-muted-foreground">
              no restaurants found. try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

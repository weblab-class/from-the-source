import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MapPin, Award, ChefHat, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface RestaurantPageProps {
  restaurantId: string | null; // can be ObjectId OR name
  onBack: () => void;
}

type ApiRestaurantDetail = {
  _id?: string | null;
  name: string;
  location?: string | null;
  city?: string | null; // if you later add it
  cuisine?: string | null;
  recipesUnlocked?: number;
  bounties?: any[];
  recipes?: any[];
};

const isObjectId = (v: string) => /^[a-fA-F0-9]{24}$/.test(v);

export function RestaurantPage({ restaurantId, onBack }: RestaurantPageProps) {
  const [data, setData] = useState<ApiRestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    if (!restaurantId) return null;
    return isObjectId(restaurantId)
      ? `/api/restaurants/${restaurantId}`
      : `/api/restaurants/name/${encodeURIComponent(restaurantId)}`;
  }, [restaurantId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!endpoint) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(endpoint, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`Failed to load restaurant (${res.status})`);

        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  if (!restaurantId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button onClick={onBack} variant="ghost" className="lowercase mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          back
        </Button>
        <p className="lowercase text-muted-foreground">no restaurant selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button onClick={onBack} variant="ghost" className="lowercase mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          back
        </Button>
        <p className="lowercase text-muted-foreground">loading…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button onClick={onBack} variant="ghost" className="lowercase mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          back
        </Button>
        <p className="lowercase text-muted-foreground">
          restaurant not found{error ? `: ${error}` : ''}
        </p>
      </div>
    );
  }

  const restaurant = {
    name: data.name,
    location: data.location ?? '—',
    city: data.city ?? '—',
    cuisine: (data.cuisine ?? '—').toLowerCase(),
    imageUrl: encodeURIComponent(`${data.name} food`),
    crackedRecipes: data.recipesUnlocked ?? (data.recipes?.length ?? 0),
    verificationRate: 0, // you can compute later
    activeBounties: data.bounties?.length ?? 0,
  };

  const restaurantRecipes = data.recipes ?? [];
  const restaurantBounties = data.bounties ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button onClick={onBack} variant="ghost" className="lowercase mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" />
        back to restaurants
      </Button>

      <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
        <div className="h-64 bg-muted relative">
          <ImageWithFallback
            src={`https://source.unsplash.com/800x400/?${restaurant.imageUrl}`}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="lowercase tracking-wide mb-2">{restaurant.name}</h1>
              <div className="flex flex-col gap-2 text-muted-foreground">
                <div className="flex items-center gap-2 lowercase">
                  <MapPin className="w-4 h-4" />
                  {restaurant.location}{restaurant.city !== '—' ? `, ${restaurant.city}` : ''}
                </div>
                <div className="flex items-center gap-2 lowercase">
                  <ChefHat className="w-4 h-4" />
                  {restaurant.cuisine}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-semibold text-primary">{restaurant.crackedRecipes}</div>
                <div className="text-sm text-muted-foreground lowercase">cracked recipes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-semibold text-amber-600">—</div>
                <div className="text-sm text-muted-foreground lowercase">avg. accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-semibold text-green-600">{restaurant.activeBounties}</div>
                <div className="text-sm text-muted-foreground lowercase">active bounties</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="recipes" className="w-full">
        <TabsList className="lowercase">
          <TabsTrigger value="recipes" className="lowercase">
            cracked recipes ({restaurantRecipes.length})
          </TabsTrigger>
          <TabsTrigger value="bounties" className="lowercase">
            active bounties ({restaurantBounties.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes" className="mt-6 space-y-6">
          {restaurantRecipes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="lowercase text-muted-foreground">no recipes cracked yet</p>
              </CardContent>
            </Card>
          ) : (
            restaurantRecipes.map((recipe: any) => (
              <Card key={recipe._id ?? recipe.id ?? recipe.recipeName}>
                <CardHeader>
                  <CardTitle className="lowercase">{recipe.recipeName ?? 'recipe'}</CardTitle>
                  <CardDescription className="lowercase">
                    {recipe.huntedBy ? `cracked by ${recipe.huntedBy}` : ''}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {recipe.questLog && (
                    <div>
                      <h4 className="lowercase mb-2 flex items-center gap-2">
                        <ChefHat className="w-4 h-4" />
                        quest log
                      </h4>
                      <p className="text-sm text-muted-foreground lowercase bg-muted p-4 rounded-lg">
                        {recipe.questLog}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="bounties" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurantBounties.length === 0 ? (
              <Card className="md:col-span-2">
                <CardContent className="py-12 text-center">
                  <p className="lowercase text-muted-foreground">no active bounties</p>
                </CardContent>
              </Card>
            ) : (
              restaurantBounties.map((bounty: any) => (
                <Card key={bounty._id ?? bounty.id ?? bounty.recipeName}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="lowercase bg-green-100 text-green-800 border-green-300">
                        {bounty.status ?? 'open'}
                      </Badge>
                      <div className="flex items-center gap-1 text-primary">
                        <Award className="w-5 h-5" />
                        <span className="font-semibold">{bounty.points ?? 0}</span>
                      </div>
                    </div>
                    <CardTitle className="lowercase">{bounty.recipeName ?? 'bounty'}</CardTitle>
                    <CardDescription className="lowercase">
                      {bounty.postedBy ? `posted by ${bounty.postedBy}` : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground lowercase mb-4">
                      {bounty.description ?? ''}
                    </p>
                    <Button className="w-full lowercase">claim bounty</Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
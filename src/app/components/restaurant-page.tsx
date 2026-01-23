import { ArrowLeft, MapPin, Award, ChefHat, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { mockRestaurants, mockRecipes, mockBounties } from '@/app/data/mock-data';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface RestaurantPageProps {
  restaurantId: string | null;
  onBack: () => void;
}

export function RestaurantPage({ restaurantId, onBack }: RestaurantPageProps) {
  const restaurant = mockRestaurants.find(r => r.id === restaurantId);
  const restaurantRecipes = mockRecipes.filter(r => r.restaurantId === restaurantId);
  const restaurantBounties = mockBounties.filter(b => b.restaurantId === restaurantId);

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button onClick={onBack} variant="ghost" className="lowercase mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          back
        </Button>
        <p className="lowercase text-muted-foreground">restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button onClick={onBack} variant="ghost" className="lowercase mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" />
        back to bounties
      </Button>

      {/* Restaurant Header */}
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
                  {restaurant.location}, {restaurant.city}
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
                <div className="text-3xl font-semibold text-amber-600">{restaurant.verificationRate}</div>
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

      {/* Tabs */}
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
            restaurantRecipes.map((recipe) => (
              <Card key={recipe.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="lowercase">
                        {recipe.difficulty}
                      </Badge>
                      <Badge className="lowercase bg-amber-100 text-amber-800 border-amber-300">
                        <Star className="w-3 h-3 mr-1" />
                        {recipe.verificationScore.toFixed(1)} accuracy
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="lowercase">{recipe.recipeName}</CardTitle>
                  <CardDescription className="lowercase">
                    cracked by {recipe.huntedBy} · {recipe.verificationCount} verifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quest Log */}
                  <div>
                    <h4 className="lowercase mb-2 flex items-center gap-2">
                      <ChefHat className="w-4 h-4" />
                      quest log
                    </h4>
                    <p className="text-sm text-muted-foreground lowercase bg-muted p-4 rounded-lg">
                      {recipe.questLog}
                    </p>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h4 className="lowercase mb-3">ingredients</h4>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm lowercase">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="lowercase mb-3">instructions</h4>
                    <ol className="space-y-3">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-3 text-sm lowercase">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          <span className="pt-0.5">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Verification Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="lowercase font-medium">verify this recipe</p>
                        <p className="text-sm text-muted-foreground lowercase">
                          made it yourself? rate how accurate it is
                        </p>
                      </div>
                      <Button variant="outline" className="lowercase">
                        submit verification
                      </Button>
                    </div>
                  </div>
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
              restaurantBounties.map((bounty) => (
                <Card key={bounty.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={`lowercase ${
                        bounty.status === 'open' 
                          ? 'bg-green-100 text-green-800 border-green-300' 
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {bounty.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-primary">
                        <Award className="w-5 h-5" />
                        <span className="font-semibold">{bounty.points}</span>
                      </div>
                    </div>
                    <CardTitle className="lowercase">{bounty.recipeName}</CardTitle>
                    <CardDescription className="lowercase">
                      posted by {bounty.postedBy}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground lowercase mb-4">
                      {bounty.description}
                    </p>
                    {bounty.claimedBy ? (
                      <div className="text-sm text-amber-600 lowercase">
                        claimed by {bounty.claimedBy} · {bounty.timeRemaining} left
                      </div>
                    ) : (
                      <Button className="w-full lowercase">claim bounty</Button>
                    )}
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

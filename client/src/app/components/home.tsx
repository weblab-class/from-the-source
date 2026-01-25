
import { useState, useEffect } from 'react';
import { Search, Plus, Clock, MapPin, Award, ChefHat } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { AddressInput } from '@/app/components/AddressInput';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { mockRecipes } from '@/app/data/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { getBounties, createBounty } from '@/app/api';

interface HomeProps {
  onNavigateToRestaurant: (restaurantId: string) => void;
  onNavigateToSubmit: () => void;
}

interface Bounty {
  _id: string;
  dishName: string;
  restaurant: string;
  location: string;
  category: string;
  pointReward: number;
  postedBy: string;
  description: string;
  status: string;
  claimedBy?: string;
  wantedBy: string[];
}

export function Home({ onNavigateToRestaurant, onNavigateToSubmit }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  
  // API state
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state for posting bounty
  const [newBounty, setNewBounty] = useState({
    dishName: '',
    restaurant: '',
    location: '',
    category: '',
    description: '',
    pointReward: 500
  });

  // Fetch bounties from API
  useEffect(() => {
    fetchBounties();
  }, []);

  const fetchBounties = async () => {
    try {
      const data = await getBounties();
      setBounties(data);
    } catch (error) {
      console.error('Error fetching bounties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostBounty = async () => {
    try {
      await createBounty(newBounty);
      setNewBounty({ dishName: '', restaurant: '', location: '', category: '', description: '', pointReward: 500 });
      setDialogOpen(false);
      fetchBounties(); // Refresh the list
    } catch (error) {
      console.error('Error posting bounty:', error);
    }
  };

  // Get unique locations
  const locations = Array.from(new Set(bounties.map(b => b.location))).filter(Boolean).sort();

  const filteredBounties = bounties.filter(bounty => {
    const matchesSearch = (bounty.dishName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (bounty.restaurant || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (bounty.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'all' || bounty.location === locationFilter;
    const matchesCuisine = cuisineFilter === 'all' || bounty.category === cuisineFilter;
    const matchesStatus = statusFilter === 'all' || bounty.status === statusFilter;
    
    return matchesSearch && matchesLocation && matchesCuisine && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-300';
      case 'claimed': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="lowercase tracking-wide mb-4">hunt down your favorite restaurant recipes</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto lowercase">
          post bounties, claim hunts, crack recipes. get rewarded for uncovering the secrets behind the dishes you love.
        </p>
      </div>

      {/* Post Bounty Button */}
      <div className="mb-8 flex justify-center">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="lowercase gap-2">
              <Plus className="w-5 h-5" />
              post a bounty
            </Button>
          </DialogTrigger>
          <DialogContent 
              className="max-w-md" 
              onPointerDownOutside={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('.pac-container') || target.closest('.pac-item')) {
                  e.preventDefault();
                }
              }}
            >
            <DialogHeader>
              <DialogTitle className="lowercase">post a new bounty</DialogTitle>
              <DialogDescription className="lowercase">
                what recipe are you looking for?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="lowercase block mb-2">recipe name</label>
                <Input 
                  placeholder="e.g., the green sauce from tacos el gordo" 
                  className="lowercase"
                  value={newBounty.dishName}
                  onChange={(e) => setNewBounty({...newBounty, dishName: e.target.value})}
                />
              </div>
              <div>
                <label className="lowercase block mb-2">restaurant name</label>
                <Input 
                  placeholder="restaurant name" 
                  className="lowercase"
                  value={newBounty.restaurant}
                  onChange={(e) => setNewBounty({...newBounty, restaurant: e.target.value})}
                />
              </div>
              <div>
                <label className="lowercase block mb-2">location</label>
                <AddressInput
                  placeholder="search for restaurant or address"
                  className="lowercase"
                  value={newBounty.location}
                  onChange={(address) => setNewBounty({...newBounty, location: address})}
                />
              </div>
              <div>
                <label className="lowercase block mb-2">cuisine type</label>
                <Select value={newBounty.category} onValueChange={(value) => setNewBounty({...newBounty, category: value})}>
                  <SelectTrigger className="lowercase">
                    <SelectValue placeholder="select cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mexican" className="lowercase">mexican</SelectItem>
                    <SelectItem value="italian" className="lowercase">italian</SelectItem>
                    <SelectItem value="asian" className="lowercase">asian</SelectItem>
                    <SelectItem value="american" className="lowercase">american</SelectItem>
                    <SelectItem value="vietnamese" className="lowercase">vietnamese</SelectItem>
                    <SelectItem value="japanese" className="lowercase">japanese</SelectItem>
                    <SelectItem value="middle eastern" className="lowercase">middle eastern</SelectItem>
                    <SelectItem value="deli" className="lowercase">deli</SelectItem>
                    <SelectItem value="other" className="lowercase">other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="lowercase block mb-2">description</label>
                <Input 
                  placeholder="tell us more about what makes this special" 
                  className="lowercase"
                  value={newBounty.description}
                  onChange={(e) => setNewBounty({...newBounty, description: e.target.value})}
                />
              </div>
              <div>
                <label className="lowercase block mb-2">point reward</label>
                <Input 
                  type="number" 
                  placeholder="500" 
                  className="lowercase"
                  value={newBounty.pointReward}
                  onChange={(e) => setNewBounty({...newBounty, pointReward: parseInt(e.target.value) || 0})}
                />
              </div>
              <Button className="w-full lowercase" onClick={handlePostBounty}>submit bounty</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="search recipes, restaurants, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 lowercase"
            />
          </div>
          
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-[200px] lowercase">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="lowercase">all locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location} className="lowercase">
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
            <SelectTrigger className="w-full sm:w-[200px] lowercase">
              <ChefHat className="w-4 h-4 mr-2" />
              <SelectValue placeholder="cuisine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="lowercase">all cuisines</SelectItem>
              <SelectItem value="mexican" className="lowercase">mexican</SelectItem>
              <SelectItem value="italian" className="lowercase">italian</SelectItem>
              <SelectItem value="american" className="lowercase">american</SelectItem>
              <SelectItem value="asian" className="lowercase">asian</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px] lowercase">
              <SelectValue placeholder="status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="lowercase">all bounties</SelectItem>
              <SelectItem value="open" className="lowercase">open</SelectItem>
              <SelectItem value="claimed" className="lowercase">claimed</SelectItem>
              <SelectItem value="completed" className="lowercase">completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs for Bounties and Cracked Recipes */}
      <Tabs defaultValue="bounties" className="w-full">
        <TabsList className="w-full sm:w-auto lowercase">
          <TabsTrigger value="bounties" className="lowercase">active bounties</TabsTrigger>
          <TabsTrigger value="recipes" className="lowercase">cracked recipes</TabsTrigger>
        </TabsList>

        <TabsContent value="bounties" className="mt-6">
          {loading ? (
            <div className="text-center py-8 lowercase">loading bounties...</div>
          ) : filteredBounties.length === 0 ? (
            <div className="text-center py-8 lowercase text-muted-foreground">no bounties found. be the first to post one!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBounties.map((bounty) => (
                <Card key={bounty._id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedBounty(bounty)}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={`lowercase ${getStatusColor(bounty.status)}`}>
                        {bounty.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-primary">
                        <Award className="w-5 h-5" />
                        <span className="font-semibold">{bounty.pointReward}</span>
                      </div>
                    </div>
                    <CardTitle className="lowercase line-clamp-2">{bounty.dishName}</CardTitle>
                    <CardDescription className="lowercase">{bounty.restaurant}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground lowercase">
                        <MapPin className="w-4 h-4" />
                        {bounty.location || 'no location'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground lowercase">
                        <ChefHat className="w-4 h-4" />
                        {bounty.category || 'uncategorized'}
                      </div>
                      {bounty.claimedBy && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 lowercase">
                          <Clock className="w-4 h-4" />
                          claimed
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2 lowercase mt-2">
                        {bounty.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recipes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRecipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="lowercase">
                      {recipe.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-amber-600">
                      <Award className="w-5 h-5" />
                      <span className="font-semibold">{recipe.verificationScore.toFixed(1)}</span>
                    </div>
                  </div>
                  <CardTitle className="lowercase line-clamp-2">{recipe.recipeName}</CardTitle>
                  <CardDescription className="lowercase">{recipe.restaurantName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground lowercase">
                      <MapPin className="w-4 h-4" />
                      {recipe.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground lowercase">
                      <ChefHat className="w-4 h-4" />
                      {recipe.cuisine}
                    </div>
                    <p className="text-sm text-muted-foreground lowercase">
                      hunted by <span className="text-primary font-medium">{recipe.huntedBy}</span>
                    </p>
                    <p className="text-sm text-muted-foreground lowercase">
                      {recipe.verificationCount} verifications
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 lowercase"
                      onClick={() => onNavigateToRestaurant(recipe.restaurantId)}
                    >
                      view recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Bounty Detail Dialog */}
      {selectedBounty && (
        <Dialog open={!!selectedBounty} onOpenChange={() => setSelectedBounty(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="lowercase text-2xl">{selectedBounty.dishName}</DialogTitle>
              <DialogDescription className="lowercase">
                {selectedBounty.restaurant} · {selectedBounty.location}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Badge className={`lowercase ${getStatusColor(selectedBounty.status)}`}>
                  {selectedBounty.status}
                </Badge>
                <div className="flex items-center gap-2 text-primary">
                  <Award className="w-6 h-6" />
                  <span className="text-2xl font-semibold">{selectedBounty.pointReward}</span>
                  <span className="lowercase text-muted-foreground">points</span>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="lowercase text-sm mb-1 text-muted-foreground">posted by</p>
                <p className="lowercase font-medium">{selectedBounty.postedBy}</p>
              </div>

              <div>
                <p className="lowercase font-medium mb-2">description</p>
                <p className="lowercase text-muted-foreground">{selectedBounty.description}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground lowercase">
                <ChefHat className="w-4 h-4" />
                cuisine: {selectedBounty.category || 'uncategorized'}
              </div>

              {selectedBounty.claimedBy ? (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="lowercase text-amber-800">
                    claimed by <span className="font-semibold">{selectedBounty.claimedBy}</span>
                  </p>
                </div>
              ) : (
                <Button 
                  className="w-full lowercase" 
                  size="lg"
                  onClick={onNavigateToSubmit}
                >
                  claim this bounty
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

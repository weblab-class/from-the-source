import { ArrowLeft, Trophy, Award, Target, Flame } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { mockLeaderboard } from '@/app/data/mock-data';

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const topHunters = mockLeaderboard.filter(entry => entry.category === 'top hunters');
  const topVerifiers = mockLeaderboard.filter(entry => entry.category === 'top verifiers');

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-600';
      case 2: return 'text-gray-500';
      case 3: return 'text-amber-700';
      default: return 'text-muted-foreground';
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 border-yellow-300';
      case 2: return 'bg-gray-100 border-gray-300';
      case 3: return 'bg-amber-100 border-amber-300';
      default: return 'bg-muted border-border';
    }
  };

  const LeaderboardList = ({ entries }: { entries: typeof topHunters }) => (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={`${entry.category}-${entry.rank}`} className={`${entry.rank <= 3 ? getRankBg(entry.rank) : ''}`}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBg(entry.rank)} border-2`}>
                {entry.rank === 1 && <Trophy className="w-6 h-6 text-yellow-600" />}
                {entry.rank === 2 && <Trophy className="w-6 h-6 text-gray-500" />}
                {entry.rank === 3 && <Trophy className="w-6 h-6 text-amber-700" />}
                {entry.rank > 3 && <span className={`font-semibold ${getRankColor(entry.rank)}`}>{entry.rank}</span>}
              </div>
              <div>
                <p className="font-semibold lowercase">{entry.username}</p>
                <p className="text-sm text-muted-foreground lowercase">
                  {entry.category === 'top hunters' ? 'recipe hunter' : 'verifier'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <Award className="w-5 h-5" />
              <span className="font-semibold text-lg">{entry.points.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button onClick={onBack} variant="ghost" className="lowercase mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" />
        back to bounties
      </Button>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Trophy className="w-16 h-16 text-primary" />
        </div>
        <h1 className="lowercase tracking-wide mb-2">leaderboard</h1>
        <p className="text-muted-foreground lowercase">
          top recipe hunters and verifiers in the community
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="lowercase flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-green-600" />
              total bounties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">142</div>
            <p className="text-sm text-muted-foreground lowercase">claimed this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="lowercase flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-amber-600" />
              recipes cracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-amber-600">89</div>
            <p className="text-sm text-muted-foreground lowercase">successfully submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="lowercase flex items-center gap-2 text-lg">
              <Flame className="w-5 h-5 text-red-600" />
              longest streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-red-600">45</div>
            <p className="text-sm text-muted-foreground lowercase">days by @sauce_whisperer</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="hunters" className="w-full">
        <TabsList className="w-full lowercase">
          <TabsTrigger value="hunters" className="flex-1 lowercase">
            <Trophy className="w-4 h-4 mr-2" />
            top hunters
          </TabsTrigger>
          <TabsTrigger value="verifiers" className="flex-1 lowercase">
            <Award className="w-4 h-4 mr-2" />
            top verifiers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hunters" className="mt-6">
          <LeaderboardList entries={topHunters} />
        </TabsContent>

        <TabsContent value="verifiers" className="mt-6">
          <LeaderboardList entries={topVerifiers} />
        </TabsContent>
      </Tabs>

      {/* How Points Work */}
      <Card className="mt-12 bg-muted">
        <CardHeader>
          <CardTitle className="lowercase">how to earn points</CardTitle>
          <CardDescription className="lowercase">different actions earn you different rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="lowercase">post a bounty</span>
            <span className="font-semibold text-primary">+50 points</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="lowercase">claim a bounty</span>
            <span className="font-semibold text-primary">+25 points</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="lowercase">submit a successful recipe</span>
            <span className="font-semibold text-primary">+bounty reward</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="lowercase">verify a recipe</span>
            <span className="font-semibold text-primary">+100 points</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="lowercase">daily login streak</span>
            <span className="font-semibold text-primary">+10 points/day</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

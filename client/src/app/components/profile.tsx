import { useState } from 'react';
import { ArrowLeft, Award, Target, CheckCircle, Flame, TrendingUp, User } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';

interface ProfileProps {
  userId: any;
  onBack: () => void;
}

export function Profile({ userId, onBack }: ProfileProps) {
  const API_ORIGIN = window.location.origin.includes("localhost")
    ? "http://localhost:5001"
    : window.location.origin;

  const profile = userId || {};
  const [newName, setNewName] = useState(profile.name || "");

  const points = profile.points || 0;
  const username = profile.name || "anonymous chef";
  const streak = profile.streak || 0;
  const joinedDate = profile.joinedDate || new Date();

  const nextLevelPoints = 15000;
  const progressToNextLevel = (points / nextLevelPoints) * 100;

  const handleUpdateName = () => {
    fetch(`${API_ORIGIN}/api/user/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
      credentials: "include"
    })
    .then(res => res.json())
    .then(updatedUser => {
       alert("name updated!");
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button onClick={onBack} variant="ghost" className="lowercase mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" />
        back to bounties
      </Button>

      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-4 mb-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-transparent border-b border-foreground lowercase text-xl focus:outline-none"
                />
                <Button onClick={handleUpdateName} size="sm" className="h-6 lowercase text-xs">save name</Button>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <Badge variant="secondary" className="lowercase">
                  <Flame className="w-3 h-3 mr-1" />
                  {streak} day streak
                </Badge>
                <Badge variant="outline" className="lowercase">
                  joined {new Date(joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="lowercase text-muted-foreground">level progress</span>
                  <span className="lowercase font-semibold">
                    {points.toLocaleString()} / {nextLevelPoints.toLocaleString()} points
                  </span>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-semibold text-primary mb-1">
                {points.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground lowercase">total points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="lowercase flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-blue-600" />
              bounties posted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-blue-600">{profile.bountiesPosted || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="lowercase flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              bounties claimed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">{profile.bountiesClaimed || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="lowercase flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-amber-600" />
              recipes submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-amber-600">{profile.recipesSubmitted || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="lowercase flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-purple-600">{profile.verificationsCompleted || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="lowercase">recent activity</CardTitle>
          <CardDescription className="lowercase">your latest contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* If you have real activity in your DB, you would map it here */}
            <p className="text-sm text-muted-foreground italic lowercase">no recent activity to show yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Trophy({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

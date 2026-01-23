import { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';

interface SubmitRecipeProps {
  onBack: () => void;
}

export function SubmitRecipe({ onBack }: SubmitRecipeProps) {
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button onClick={onBack} variant="ghost" className="lowercase mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" />
        back to bounties
      </Button>

      <div className="mb-8">
        <h1 className="lowercase tracking-wide mb-2">submit a recipe</h1>
        <p className="text-muted-foreground lowercase">
          cracked a recipe? share it with the community and earn points
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="lowercase">basic information</CardTitle>
            <CardDescription className="lowercase">
              tell us about the recipe you cracked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="lowercase block mb-2">recipe name</label>
              <Input 
                placeholder="e.g., the green sauce from tacos el gordo" 
                className="lowercase"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="lowercase block mb-2">restaurant name</label>
                <Input 
                  placeholder="restaurant name" 
                  className="lowercase"
                />
              </div>

              <div>
                <label className="lowercase block mb-2">location</label>
                <Input 
                  placeholder="city or address" 
                  className="lowercase"
                />
              </div>
            </div>

            <div>
              <label className="lowercase block mb-2">cuisine type</label>
              <Select>
                <SelectTrigger className="lowercase">
                  <SelectValue placeholder="select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mexican" className="lowercase">mexican</SelectItem>
                  <SelectItem value="italian" className="lowercase">italian</SelectItem>
                  <SelectItem value="asian" className="lowercase">asian</SelectItem>
                  <SelectItem value="american" className="lowercase">american</SelectItem>
                  <SelectItem value="vietnamese" className="lowercase">vietnamese</SelectItem>
                  <SelectItem value="middle eastern" className="lowercase">middle eastern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="lowercase block mb-2">difficulty / method used</label>
              <Select>
                <SelectTrigger className="lowercase">
                  <SelectValue placeholder="how did you get this recipe?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walked in and asked" className="lowercase">
                    walked in and asked
                  </SelectItem>
                  <SelectItem value="reverse-engineered" className="lowercase">
                    reverse-engineered
                  </SelectItem>
                  <SelectItem value="found an ex-employee" className="lowercase">
                    found an ex-employee
                  </SelectItem>
                  <SelectItem value="took multiple attempts" className="lowercase">
                    took multiple attempts
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quest Log */}
        <Card>
          <CardHeader>
            <CardTitle className="lowercase">quest log (required)</CardTitle>
            <CardDescription className="lowercase">
              tell the story of how you got this recipe. the more detail, the better!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="walked in during off hours (3pm). asked the guy at the counter super nicely. he said most people don't just ask. he wrote down the basics on a napkin. tested it 4 times to get the ratios right."
              className="min-h-[120px] lowercase"
            />
            <p className="text-sm text-muted-foreground mt-2 lowercase">
              this helps others understand your process and builds trust in the recipe
            </p>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle className="lowercase">ingredients</CardTitle>
            <CardDescription className="lowercase">
              list all ingredients with measurements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <Input 
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder="e.g., 1 cup mayo"
                  className="lowercase flex-1"
                />
                {ingredients.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addIngredient}
              className="w-full lowercase gap-2"
            >
              <Plus className="w-4 h-4" />
              add ingredient
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="lowercase">instructions</CardTitle>
            <CardDescription className="lowercase">
              step-by-step directions for making this recipe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm mt-1">
                  {index + 1}
                </div>
                <Textarea 
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder="describe this step..."
                  className="lowercase flex-1 min-h-[80px]"
                />
                {instructions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInstruction(index)}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addInstruction}
              className="w-full lowercase gap-2"
            >
              <Plus className="w-4 h-4" />
              add step
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="lowercase font-medium">ready to submit?</p>
                  <p className="text-sm text-muted-foreground lowercase">
                    your recipe will be reviewed by the community
                  </p>
                </div>
                <Badge className="lowercase">+500 points</Badge>
              </div>
              <Button size="lg" className="w-full lowercase">
                submit recipe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

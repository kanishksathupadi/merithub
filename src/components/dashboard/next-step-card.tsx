import type { SuggestNextStepOutput } from "@/ai/flows/suggest-next-step";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight, CheckCircle } from "lucide-react";

type NextStepCardProps = {
  suggestion: SuggestNextStepOutput;
};

export function NextStepCard({ suggestion }: NextStepCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/20 to-background shadow-lg border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Lightbulb className="text-accent w-7 h-7" />
                    Your Next Step
                </CardTitle>
                <CardDescription>The most important action for you right now.</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
                Suggest another <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-foreground">{suggestion.nextStep}</h3>
            <p className="text-muted-foreground mt-2">{suggestion.reasoning}</p>
            <div className="mt-6 flex gap-4">
                <Button className="bg-accent hover:bg-accent/90">
                    <CheckCircle className="w-4 h-4 mr-2" /> Mark as Complete
                </Button>
                <Button variant="outline">View in Roadmap</Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

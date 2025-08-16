
import type { SuggestNextStepOutput } from "@/ai/flows/suggest-next-step";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, BookOpen, User, Star, CheckCircle } from "lucide-react";

type NextStepCardProps = {
  suggestion: SuggestNextStepOutput;
};

export function NextStepCard({ suggestion }: NextStepCardProps) {
  const ensureArray = (items: string | string[] | undefined) => {
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') return [items];
    return [];
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Lightbulb className="text-primary w-7 h-7" />
                    Your Strategic Plan: {suggestion.title}
                </CardTitle>
                <CardDescription className="mt-2">{suggestion.introduction}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue={`item-${suggestion.plan[0]?.grade}`}>
          {suggestion.plan.map((item, index) => (
            <AccordionItem value={`item-${item.grade}`} key={index}>
              <AccordionTrigger className="text-lg font-semibold">
                {item.grade}: {item.focus}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pl-2">
                <div className="flex items-start gap-4">
                  <BookOpen className="w-5 h-5 mt-1 text-primary"/>
                  <div>
                    <h4 className="font-semibold">Academics</h4>
                    <ul className="list-none space-y-1 mt-1 text-muted-foreground">
                        {ensureArray(item.academics).map((task, i) => <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-1 text-green-500 shrink-0"/><span>{task}</span></li>)}
                    </ul>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <User className="w-5 h-5 mt-1 text-primary"/>
                  <div>
                    <h4 className="font-semibold">Extracurriculars</h4>
                    <ul className="list-none space-y-1 mt-1 text-muted-foreground">
                        {ensureArray(item.extracurriculars).map((task, i) => <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-1 text-green-500 shrink-0"/><span>{task}</span></li>)}
                    </ul>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <Star className="w-5 h-5 mt-1 text-primary"/>
                  <div>
                    <h4 className="font-semibold">Skill Building</h4>
                    <ul className="list-none space-y-1 mt-1 text-muted-foreground">
                        {ensureArray(item.skillBuilding).map((task, i) => <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-1 text-green-500 shrink-0"/><span>{task}</span></li>)}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

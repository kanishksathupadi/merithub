
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Search, SlidersHorizontal } from "lucide-react";

const mentors = [
  { name: 'Dr. Evelyn Reed', subject: 'STEM & Research', institution: 'MIT', avatar: 'ER', hint: 'female scientist' },
  { name: 'Marcus Cole', subject: 'Humanities & Law', institution: 'Harvard', avatar: 'MC', hint: 'male lawyer' },
  { name: 'Priya Sharma', subject: 'Business & Entrepreneurship', institution: 'Wharton', avatar: 'PS', hint: 'business woman' },
  { name: 'David Chen', subject: 'Arts & Design', institution: 'RISD', avatar: 'DC', hint: 'male artist' },
  { name: 'Dr. Aisha Khan', subject: 'Medicine & Health Sciences', institution: 'Johns Hopkins', avatar: 'AK', hint: 'female doctor' },
  { name: 'Ben Carter', subject: 'Computer Science & AI', institution: 'Stanford', avatar: 'BC', hint: 'male programmer' },
];

export default function MentorMatchPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Mentor Match</h1>
        <p className="text-muted-foreground">Connect with experienced mentors to guide you on your journey.</p>
      </header>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search by name, subject, or university..." className="pl-10" />
            </div>
            <div className="flex gap-4">
                <Select>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by Subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="stem">STEM & Research</SelectItem>
                        <SelectItem value="humanities">Humanities & Law</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="arts">Arts & Design</SelectItem>
                        <SelectItem value="medicine">Medicine</SelectItem>
                        <SelectItem value="cs">Computer Science</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                    <SlidersHorizontal className="w-5 h-5"/>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center p-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint={mentor.hint} />
                <AvatarFallback>{mentor.avatar}</AvatarFallback>
              </Avatar>
              <CardTitle>{mentor.name}</CardTitle>
              <p className="text-sm text-primary font-medium">{mentor.subject}</p>
              <p className="text-xs text-muted-foreground">{mentor.institution}</p>
            </CardHeader>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" /> Connect
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

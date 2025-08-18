
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Search, SlidersHorizontal } from "lucide-react";

const mentors = [
  { name: 'Dr. Evelyn Reed', subject: 'STEM & Research', institution: 'MIT', avatar: 'ER', hint: 'female scientist', imageUrl: 'https://images.unsplash.com/photo-1630959305606-3123a081dada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmZW1hbGUlMjBzY2llbnRpc3R8ZW58MHx8fHwxNzU1NTU1NjUzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Marcus Cole', subject: 'Humanities & Law', institution: 'Harvard', avatar: 'MC', hint: 'male lawyer', imageUrl: 'https://images.unsplash.com/photo-1658249682512-1bb162538ba9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtYWxlJTIwbGF3eWVyfGVufDB8fHx8MTc1NTUxNDk0OHww&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Priya Sharma', subject: 'Business & Entrepreneurship', institution: 'Wharton', avatar: 'PS', hint: 'business woman', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMHdvbWFufGVufDB8fHx8MTc1NTU1NTY1Mnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'David Chen', subject: 'Arts & Design', institution: 'RISD', avatar: 'DC', hint: 'male artist', imageUrl: 'https://images.unsplash.com/photo-1704636487563-8e7c4802680e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8bWFsZSUyMGFydGlzdHxlbnwwfHx8fDE3NTU1NTU2NTN8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Dr. Aisha Khan', subject: 'Medicine & Health Sciences', institution: 'Johns Hopkins', avatar: 'AK', hint: 'female doctor', imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmZW1hbGUlMjBkb2N0b3J8ZW58MHx8fHwxNzU1NTU1NjUyfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Ben Carter', subject: 'Computer Science & AI', institution: 'Stanford', avatar: 'BC', hint: 'male programmer', imageUrl: 'https://images.unsplash.com/photo-1713947503813-da5351679a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYWxlJTIwcHJvZ3JhbW1lcnxlbnwwfHx8fDE3NTU1NTU2NTN8MA&ixlib=rb-4.1.0&q=80&w=1080' },
];

const subjects = [...new Set(mentors.map(m => m.subject))];

export default function MentorMatchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("all");

    const filteredMentors = mentors.filter(mentor => {
        const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              mentor.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              mentor.institution.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === "all" || mentor.subject === selectedSubject;
        return matchesSearch && matchesSubject;
    });


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
              <Input 
                placeholder="Search by name, subject, or university..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-full md:w-[240px]">
                        <SelectValue placeholder="Filter by Subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map(subject => (
                             <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
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
        {filteredMentors.map((mentor, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="items-center text-center p-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={mentor.imageUrl} data-ai-hint={mentor.hint} />
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

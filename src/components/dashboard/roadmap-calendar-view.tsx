
"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views, NavigateAction } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import type { RoadmapTask } from "@/lib/types";
import { parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { cn } from "@/lib/utils";

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    resource: RoadmapTask;
}

const getCategoryColor = (category: RoadmapTask['category']) => {
    switch(category) {
        case 'Academics': return 'bg-blue-500/20 border-blue-500 text-blue-200';
        case 'Extracurriculars': return 'bg-green-500/20 border-green-500 text-green-200';
        case 'Skill Building': return 'bg-yellow-500/20 border-yellow-500 text-yellow-200';
        default: return 'bg-gray-500/20 border-gray-500 text-gray-200';
    }
};

export function RoadmapCalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      let storedTasks = localStorage.getItem('roadmapTasks');
      if (storedTasks) {
        let parsedTasks: RoadmapTask[] = JSON.parse(storedTasks);
        const calendarEvents = parsedTasks.map(task => {
            const eventDate = task.dueDate ? parseISO(task.dueDate) : new Date();
            return {
                title: task.title,
                start: eventDate,
                end: eventDate,
                allDay: true,
                resource: task,
            };
        });
        setEvents(calendarEvents);
      }
    } catch (error) {
        console.error("Failed to parse roadmap tasks from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
        <div className="mt-4 h-full">
            <Skeleton className="h-full w-full" />
        </div>
    );
  }

  return (
    <div className="mt-4 h-full bg-card p-4 rounded-lg border">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day', 'agenda']}
        eventPropGetter={(event) => {
            const className = cn(
                "p-1 rounded-md text-xs border",
                getCategoryColor(event.resource.category),
                event.resource.completed && "opacity-50 line-through"
            );
            return { className };
        }}
        onShowMore={(events, date) => {
            // In a real app, you might open a modal here.
            // For now, we can just log it.
            console.log(`More events for ${date}:`, events);
        }}
      />
    </div>
  );
}

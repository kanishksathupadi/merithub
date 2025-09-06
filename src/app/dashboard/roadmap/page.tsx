
"use client";
import { RoadmapView } from "@/components/dashboard/roadmap-view";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, PlusCircle, List, CalendarDays, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { RoadmapTask } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarView } from "@/components/dashboard/calendar-view";


const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

const resourceSchema = z.object({
  title: z.string().optional(),
  url: z.string().optional(),
});


const taskSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
  dueDate: z.date().optional(),
  recurringDays: z.array(z.string()).optional(),
  resource: resourceSchema.optional(),
});

const updateMasterUserList = (email: string, updatedTasks: RoadmapTask[]) => {
  try {
    const allUsersStr = localStorage.getItem('allSignups');
    if (allUsersStr) {
      let allUsers = JSON.parse(allUsersStr);
      allUsers = allUsers.map((user: any) => {
        if (user.email === email) {
          return { ...user, tasks: updatedTasks };
        }
        return user;
      });
      localStorage.setItem('allSignups', JSON.stringify(allUsers));
    }
  } catch(e) {
    console.error("Failed to update master user list:", e);
  }
}

export default function RoadmapPage() {
  const [update, setUpdate] = useState(0);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const handleStorageChange = () => {
      setUpdate(u => u + 1);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      recurringDays: [],
      resource: { title: "", url: "" },
    },
  });

  const onSubmit = (values: z.infer<typeof taskSchema>) => {
    let userEmail: string | null = null;
    const signupDataStr = localStorage.getItem('signupData');
    if (signupDataStr) {
        const signupData = JSON.parse(signupDataStr);
        userEmail = signupData.email;
    }

    if (!userEmail) {
      toast({ variant: "destructive", title: "Error", description: "Could not identify user." });
      return;
    }
    
    const newTask: RoadmapTask = {
      id: uuidv4(),
      title: values.title,
      description: values.description,
      category: values.category as any, // Cast to any to allow custom strings
      grade: "Custom",
      completed: false,
      relatedResources: (values.resource && values.resource.url && values.resource.title) ? [{title: values.resource.title, url: values.resource.url}] as { title: string, url: string }[] : [],
      dueDate: values.dueDate?.toISOString(),
      recurringDays: values.recurringDays,
    };
    
    const storedTasksStr = localStorage.getItem(`roadmapTasks-${userEmail}`);
    const tasks = storedTasksStr ? JSON.parse(storedTasksStr) : [];
    const updatedTasks = [...tasks, newTask];

    localStorage.setItem(`roadmapTasks-${userEmail}`, JSON.stringify(updatedTasks));
    updateMasterUserList(userEmail, updatedTasks);

    window.dispatchEvent(new Event('storage'));
    
    if (values.dueDate) {
        toast({
            title: "Task Added!",
            description: "Your custom task has been added to your roadmap and calendar.",
        });
    } else {
        toast({
            title: "Task Added!",
            description: "Note: Tasks without a due date will not appear on the calendar view.",
        });
    }

    form.reset();
    setDialogOpen(false);
  };


  return (
    <div className="space-y-8 h-full flex flex-col">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Roadmap</h1>
          <p className="text-muted-foreground">Your personalized list of tasks and milestones.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant={activeView === 'list' ? 'default' : 'outline'} onClick={() => setActiveView('list')}>
                <List className="mr-2"/>
                List View
            </Button>
            <Button variant={activeView === 'calendar' ? 'default' : 'outline'} onClick={() => setActiveView('calendar')}>
                <CalendarDays className="mr-2"/>
                Calendar View
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                <PlusCircle className="w-4 h-4 mr-2"/>
                Add Custom Task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add a Custom Task</DialogTitle>
                <DialogDescription>
                    Add a new task to your personalized roadmap.
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Task Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Prepare for Math Olympiad" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Describe the task in a bit more detail..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Academics, Volunteering, Health" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Due Date (Optional)</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date < new Date(new Date().setHours(0,0,0,0)) // disable past dates
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="recurringDays"
                    render={() => (
                        <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">Recurring Days (Optional)</FormLabel>
                        </div>
                        <div className="flex flex-wrap gap-4">
                        {daysOfWeek.map((day) => (
                            <FormField
                            key={day}
                            control={form.control}
                            name="recurringDays"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={day}
                                    className="flex flex-row items-start space-x-2 space-y-0"
                                >
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(day)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), day])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== day
                                                )
                                            )
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal capitalize">
                                    {day}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                            />
                        ))}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                     <div className="space-y-4 rounded-md border p-4">
                        <h4 className="text-sm font-medium">Resource (Optional)</h4>
                        <FormField
                            control={form.control}
                            name="resource.title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Resource Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Khan Academy Calculus" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="resource.url"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Resource URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>


                    <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Add Task</Button>
                    </DialogFooter>
                </form>
                </Form>
            </DialogContent>
            </Dialog>
        </div>
      </header>
       <div className="flex-1">
            {activeView === 'list' ? (
                <RoadmapView key={`list-${update}`} />
            ) : (
                <CalendarView key={`calendar-${update}`} />
            )}
        </div>
    </div>
  );
}

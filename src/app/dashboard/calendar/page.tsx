"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Calendar as CalendarIcon, List } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, startOfMonth, endOfMonth, isSameMonth, addMonths, subMonths } from "date-fns";
import { AddEventModal } from "@/components/modals/AddEventModal";
import { EditEventModal } from "@/components/modals/EditEventModal";
import { DeleteConfirmDialog } from "@/components/modals/DeleteConfirmDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useApi } from "@/hooks/useApi";
import { useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";

interface Event {
  _id: string;
  id?: string;
  title: string;
  start: Date;
  end: Date;
  type: string;
  date: string;
  time: string;
  duration: string;
  description?: string;
  category: string;
}

export default function CalendarPage() {
  const api = useApi();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Week View Calculations
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Month View Calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthGridStart = startOfWeek(monthStart);
  const monthGridEnd = endOfWeek(monthEnd);
  const monthDays = eachDayOfInterval({ start: monthGridStart, end: monthGridEnd });

  const nextPeriod = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 7));
    }
  };

  const prevPeriod = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, -7));
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsAddEventModalOpen(true);
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      const mappedEvents = response.data.map((e: any) => ({
        ...e,
        start: new Date(`${e.date}T${e.time}`),
        end: new Date(new Date(`${e.date}T${e.time}`).getTime() + parseInt(e.duration) * 60000),
        type: e.category === 'meeting' ? 'work' : e.category === 'personal' ? 'personal' : 'health',
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [api]);

  const handleEventSubmit = async (eventData: any) => {
    try {
      const response = await api.post('/events', eventData);
      const newEvent = {
        ...response.data,
        start: new Date(`${response.data.date}T${response.data.time}`),
        end: new Date(new Date(`${response.data.date}T${response.data.time}`).getTime() + parseInt(response.data.duration) * 60000),
        type: response.data.category === 'meeting' ? 'work' : response.data.category === 'personal' ? 'personal' : 'health',
      };
      setEvents([...events, newEvent]);
      setIsAddEventModalOpen(false);
    } catch (error) {
      console.error("Failed to create event", error);
    }
  };

  const handleEventClick = (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = async (updatedEvent: any) => {
    try {
      const response = await api.put(`/events/${updatedEvent._id || updatedEvent.id}`, updatedEvent);
      const mappedEvent = {
        ...response.data,
        start: new Date(`${response.data.date}T${response.data.time}`),
        end: new Date(new Date(`${response.data.date}T${response.data.time}`).getTime() + parseInt(response.data.duration) * 60000),
        type: response.data.category === 'meeting' ? 'work' : response.data.category === 'personal' ? 'personal' : 'health',
      };
      setEvents(events.map(e => (e._id === updatedEvent._id || e.id === updatedEvent.id) ? mappedEvent : e));
      setIsEditModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Failed to update event", error);
    }
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      setDeletingEventId(editingEvent.id);
      setIsDeleteConfirmOpen(true);
      setIsEditModalOpen(false); // Close edit modal when asking for delete confirmation
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingEventId) {
      try {
        await api.delete(`/events/${deletingEventId}`);
        setEvents(events.filter(e => e._id !== deletingEventId && e.id !== deletingEventId));
        setIsDeleteConfirmOpen(false);
        setDeletingEventId(null);
        setEditingEvent(null);
      } catch (error) {
        console.error("Failed to delete event", error);
      }
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(v: "month" | "week") => setView(v)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center border rounded-md bg-background">
            <Button variant="ghost" size="icon" onClick={prevPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium min-w-[140px] text-center px-2">
              {view === "month" 
                ? format(currentDate, "MMMM yyyy")
                : `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`
              }
            </div>
            <Button variant="ghost" size="icon" onClick={nextPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={() => {
            setSelectedDate(new Date());
            setIsAddEventModalOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {view === "month" ? (
        <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden border shadow-sm">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-background p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {monthDays.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const dayEvents = events.filter(event => isSameDay(event.start, day));
            
            return (
              <div 
                key={day.toString()} 
                className={`bg-background min-h-[120px] p-2 transition-colors hover:bg-muted/20 cursor-pointer ${
                  !isCurrentMonth ? 'text-muted-foreground bg-muted/5' : ''
                }`}
                onClick={() => handleDateClick(day)}
              >
                <div className={`text-right mb-1`}>
                  <span className={`text-sm p-1 rounded-full w-7 h-7 inline-flex items-center justify-center ${
                    isToday(day) ? 'bg-primary text-primary-foreground font-bold' : ''
                  }`}>
                    {format(day, "d")}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event._id || event.id} 
                      onClick={(e) => handleEventClick(e, event)}
                      className={`text-xs px-1.5 py-0.5 rounded truncate border-l-2 hover:opacity-80 transition-opacity ${
                        event.type === 'work' ? 'bg-blue-100 text-blue-700 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300' :
                        event.type === 'personal' ? 'bg-yellow-100 text-yellow-700 border-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-green-100 text-green-700 border-green-500 dark:bg-green-900/30 dark:text-green-300'
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => (
            <div key={day.toString()} className="space-y-2">
              <div className={`text-center p-2 rounded-lg ${isToday(day) ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>
                <div className="text-xs uppercase font-semibold opacity-70">{format(day, "EEE")}</div>
                <div className="text-lg font-bold">{format(day, "d")}</div>
              </div>
              <div 
                className="space-y-2 min-h-[500px] bg-muted/10 rounded-lg p-2 border border-dashed hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => handleDateClick(day)}
              >
                {events.filter(event => isSameDay(event.start, day)).map(event => (
                  <Card 
                    key={event._id || event.id} 
                    onClick={(e) => handleEventClick(e, event)}
                    className={`border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                    event.type === 'work' ? 'border-l-blue-500' :
                    event.type === 'personal' ? 'border-l-yellow-500' :
                    'border-l-green-500'
                  }`}>
                    <CardContent className="p-3">
                      <div className="font-semibold text-sm truncate">{event.title}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        {format(event.start, "h:mm a")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddEventModal
        open={isAddEventModalOpen}
        onOpenChange={setIsAddEventModalOpen}
        initialDate={selectedDate}
        onSubmit={handleEventSubmit}
      />

      <EditEventModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        event={editingEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
      />

      {/* We need a way to trigger delete from the edit modal, or add a delete button there. 
          For now, let's assume the EditEventModal could have a delete button, or we add one here if we modify the modal.
          Actually, let's modify the EditEventModal to include a delete button or handle it here. 
          Since I can't easily modify the modal prop interface right now without another file edit, 
          I'll add a Delete button to the footer of the EditEventModal in a future step or assume the user can delete via a separate mechanism?
          
          Wait, I should have added a delete button to EditEventModal. 
          Let's add a "Delete Event" button to the EditEventModal footer in the previous step or update it now.
          
          Actually, I'll just add the DeleteConfirmDialog here and maybe add a delete button to the EditEventModal in a separate step if needed.
          But wait, I can't easily trigger delete from the modal if I didn't pass a onDelete prop.
          
          Let's update EditEventModal to accept onDelete.
      */}
      
      <DeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
      />
      </div>
    </PageTransition>
  );
}

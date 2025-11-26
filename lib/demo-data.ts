import { Festival } from "@/types/festival";

export function generateDemoFestival(): Festival {
  const dayId = "demo-day-1";

  const stages = [
    { id: "stage-1", name: "Main Stage", color: "#3b82f6" },
    { id: "stage-2", name: "Left Foot Stage", color: "#8b5cf6" },
    { id: "stage-3", name: "The Grove", color: "#10b981" },
    { id: "stage-4", name: "Silent Disco", color: "#f59e0b" },
  ];

  const today = new Date();
  const festivalDate = new Date(today);
  festivalDate.setDate(today.getDate() + 30);
  const dateString = festivalDate.toISOString().split("T")[0];

  const artists = [
    {
      id: "a1",
      artistName: "The Midnight Runners",
      stageId: "stage-1",
      startTime: "14:00",
      endTime: "15:00",
      priority: "maybe" as const,
      dayId,
    },
    {
      id: "a2",
      artistName: "Electric Sunrise",
      stageId: "stage-2",
      startTime: "14:00",
      endTime: "14:45",
      priority: "skip" as const,
      dayId,
    },
    {
      id: "a3",
      artistName: "Luna & The Waves",
      stageId: "stage-3",
      startTime: "14:30",
      endTime: "15:30",
      priority: "must" as const,
      dayId,
    },
    {
      id: "a4",
      artistName: "DJ Neon Dreams",
      stageId: "stage-4",
      startTime: "14:00",
      endTime: "16:00",
      priority: "maybe" as const,
      dayId,
    },

    {
      id: "a5",
      artistName: "The Velvet Underground Revival",
      stageId: "stage-1",
      startTime: "15:30",
      endTime: "16:30",
      priority: "must" as const,
      dayId,
    },
    {
      id: "a6",
      artistName: "Cosmic Funk Collective",
      stageId: "stage-2",
      startTime: "15:15",
      endTime: "16:15",
      priority: "maybe" as const,
      dayId,
    },
    {
      id: "a7",
      artistName: "Indie Hearts",
      stageId: "stage-3",
      startTime: "16:00",
      endTime: "17:00",
      priority: "skip" as const,
      dayId,
    },

    {
      id: "a8",
      artistName: "Bass Rebel Sound System",
      stageId: "stage-1",
      startTime: "17:00",
      endTime: "18:00",
      priority: "must" as const,
      dayId,
    },
    {
      id: "a9",
      artistName: "The Analog Kids",
      stageId: "stage-2",
      startTime: "16:45",
      endTime: "17:45",
      priority: "must" as const,
      dayId,
    },
    {
      id: "a10",
      artistName: "Sunset Groove",
      stageId: "stage-3",
      startTime: "17:30",
      endTime: "18:30",
      priority: "maybe" as const,
      dayId,
    },
    {
      id: "a11",
      artistName: "Silent Storm DJ Set",
      stageId: "stage-4",
      startTime: "16:30",
      endTime: "18:30",
      priority: "skip" as const,
      dayId,
    },

    {
      id: "a12",
      artistName: "Phoenix Rising",
      stageId: "stage-1",
      startTime: "18:30",
      endTime: "19:45",
      priority: "must" as const,
      dayId,
    },
    {
      id: "a13",
      artistName: "Retro Wave",
      stageId: "stage-2",
      startTime: "18:15",
      endTime: "19:15",
      priority: "maybe" as const,
      dayId,
    },
    {
      id: "a14",
      artistName: "The Wildcards",
      stageId: "stage-3",
      startTime: "19:00",
      endTime: "20:00",
      priority: "skip" as const,
      dayId,
    },

    {
      id: "a15",
      artistName: "Starlight Symphony",
      stageId: "stage-1",
      startTime: "20:15",
      endTime: "21:45",
      priority: "must" as const,
      dayId,
    },
    {
      id: "a16",
      artistName: "Electronic Dreams",
      stageId: "stage-2",
      startTime: "19:45",
      endTime: "20:45",
      priority: "must" as const,
      dayId,
    },
    {
      id: "a17",
      artistName: "The Last Call",
      stageId: "stage-3",
      startTime: "20:30",
      endTime: "21:30",
      priority: "maybe" as const,
      dayId,
    },
    {
      id: "a18",
      artistName: "Late Night Vibes",
      stageId: "stage-4",
      startTime: "19:00",
      endTime: "22:00",
      priority: "skip" as const,
      dayId,
    },

    {
      id: "a19",
      artistName: "Headline Act Supreme",
      stageId: "stage-1",
      startTime: "22:00",
      endTime: "23:30",
      priority: "must" as const,
      dayId,
    },
    {
      id: "a20",
      artistName: "After Hours Collective",
      stageId: "stage-2",
      startTime: "21:15",
      endTime: "22:30",
      priority: "maybe" as const,
      dayId,
    },
  ];

  return {
    id: "demo-festival",
    name: "Summer Sounds Festival 2025",
    days: [
      {
        id: dayId,
        date: dateString,
        stages,
      },
    ],
    artists,
    contactInfo: {
      name: "Your Name",
      phone: "+1 (555) 123-4567",
      alternateContact: "friend@example.com",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export type ArtistPriority = "must" | "maybe" | "skip";

export interface ContactInfo {
  name: string;
  phone: string;
  alternateContact?: string;
}

export interface Stage {
  id: string;
  name: string;
  color?: string;
}

export interface ArtistSlot {
  id: string;
  artistName: string;
  stageId: string;
  startTime: string;
  endTime: string;
  priority: ArtistPriority;
  dayId: string;
}

export interface FestivalDay {
  id: string;
  date: string;
  stages: Stage[];
}

export interface Festival {
  id: string;
  name: string;
  days: FestivalDay[];
  artists: ArtistSlot[];
  contactInfo?: ContactInfo;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShareablePlan {
  festivalId: string;
  shareId: string;
  festival: Festival;
  createdAt: string;
}

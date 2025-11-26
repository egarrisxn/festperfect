"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Festival, ArtistSlot, ContactInfo } from "@/types/festival";
import { storage } from "@/lib/festival-storage";
import { supabase } from "@/lib/supabase";

interface FestivalContextType {
  festival: Festival | null;
  setFestival: (festival: Festival) => void;
  updateArtistPriority: (
    artistId: string,
    priority: ArtistSlot["priority"]
  ) => void;
  updateContactInfo: (contactInfo: ContactInfo) => void;
  clearFestival: () => void;
  saveFestivalToSupabase: () => Promise<string | null>;
  loadFestivalFromSupabase: (festivalId: string) => Promise<void>;
  isLoading: boolean;
}

const FestivalContext = createContext<FestivalContextType | undefined>(
  undefined
);

export function FestivalProvider({ children }: { children: ReactNode }) {
  const [festival, setFestivalState] = useState<Festival | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedFestival = storage.loadFestival();
    setFestivalState(loadedFestival);
    setIsLoading(false);
  }, []);

  const setFestival = (newFestival: Festival) => {
    setFestivalState(newFestival);
    storage.saveFestival(newFestival);
  };

  const updateArtistPriority = (
    artistId: string,
    priority: ArtistSlot["priority"]
  ) => {
    if (!festival) return;

    const updatedArtists = festival.artists.map((artist) =>
      artist.id === artistId ? { ...artist, priority } : artist
    );

    const updatedFestival = {
      ...festival,
      artists: updatedArtists,
      updatedAt: new Date().toISOString(),
    };
    setFestival(updatedFestival);
  };

  const updateContactInfo = (contactInfo: ContactInfo) => {
    if (!festival) return;

    const updatedFestival = {
      ...festival,
      contactInfo,
      updatedAt: new Date().toISOString(),
    };
    setFestival(updatedFestival);
  };

  const clearFestival = () => {
    setFestivalState(null);
    storage.clearFestival();
  };

  const saveFestivalToSupabase = async (): Promise<string | null> => {
    if (!festival) return null;

    try {
      const { data: festivalData, error: festivalError } = await supabase
        .from("festivals")
        .insert({ name: festival.name })
        .select()
        .single();

      if (festivalError) throw festivalError;

      for (const day of festival.days) {
        const { data: dayData, error: dayError } = await supabase
          .from("festival_days")
          .insert({ festival_id: festivalData.id, date: day.date })
          .select()
          .single();

        if (dayError) throw dayError;

        for (const stage of day.stages) {
          await supabase.from("stages").insert({
            festival_day_id: dayData.id,
            name: stage.name,
            color: stage.color || "",
          });
        }
      }

      const stagesResponse = await supabase
        .from("stages")
        .select("id, name, festival_day_id")
        .in(
          "festival_day_id",
          festival.days.map((d) => {
            return festival.days.find((day) => day.id === d.id);
          })
        );

      const stageMap = new Map<string, string>();
      if (stagesResponse.data) {
        stagesResponse.data.forEach((stage) => {
          const originalStage = festival.days
            .flatMap((d) => d.stages)
            .find((s) => s.name === stage.name);
          if (originalStage) {
            stageMap.set(originalStage.id, stage.id);
          }
        });
      }

      for (const artist of festival.artists) {
        const dbStageId = stageMap.get(artist.stageId);
        const day = festival.days.find((d) => d.id === artist.dayId);

        if (dbStageId && day) {
          const { data: dayData } = await supabase
            .from("festival_days")
            .select("id")
            .eq("festival_id", festivalData.id)
            .eq("date", day.date)
            .single();

          if (dayData) {
            await supabase.from("artist_slots").insert({
              festival_id: festivalData.id,
              festival_day_id: dayData.id,
              stage_id: dbStageId,
              artist_name: artist.artistName,
              start_time: artist.startTime,
              end_time: artist.endTime,
              priority: artist.priority,
            });
          }
        }
      }

      if (festival.contactInfo) {
        await supabase.from("contact_info").insert({
          festival_id: festivalData.id,
          name: festival.contactInfo.name,
          phone: festival.contactInfo.phone,
          alternate_contact: festival.contactInfo.alternateContact || "",
        });
      }

      return festivalData.id;
    } catch (error) {
      console.error("Error saving festival to Supabase:", error);
      return null;
    }
  };

  const loadFestivalFromSupabase = async (
    festivalId: string
  ): Promise<void> => {
    try {
      setIsLoading(true);

      const { data: festivalData, error: festivalError } = await supabase
        .from("festivals")
        .select("*")
        .eq("id", festivalId)
        .single();

      if (festivalError) throw festivalError;

      const { data: daysData, error: daysError } = await supabase
        .from("festival_days")
        .select("*")
        .eq("festival_id", festivalId);

      if (daysError) throw daysError;

      const { data: artistsData, error: artistsError } = await supabase
        .from("artist_slots")
        .select("*")
        .eq("festival_id", festivalId);

      if (artistsError) throw artistsError;

      const { data: contactData } = await supabase
        .from("contact_info")
        .select("*")
        .eq("festival_id", festivalId)
        .maybeSingle();

      const days = await Promise.all(
        daysData.map(async (day) => {
          const { data: stagesData } = await supabase
            .from("stages")
            .select("*")
            .eq("festival_day_id", day.id);

          return {
            id: day.id,
            date: day.date,
            stages: (stagesData || []).map((stage) => ({
              id: stage.id,
              name: stage.name,
              color: stage.color || undefined,
            })),
          };
        })
      );

      const artists = artistsData.map((artist) => ({
        id: artist.id,
        artistName: artist.artist_name,
        stageId: artist.stage_id,
        startTime: artist.start_time,
        endTime: artist.end_time,
        priority: artist.priority as ArtistSlot["priority"],
        dayId: artist.festival_day_id,
      }));

      const loadedFestival: Festival = {
        id: festivalData.id,
        name: festivalData.name,
        days,
        artists,
        contactInfo: contactData
          ? {
              name: contactData.name,
              phone: contactData.phone,
              alternateContact: contactData.alternate_contact || undefined,
            }
          : undefined,
        createdAt: festivalData.created_at,
        updatedAt: festivalData.updated_at,
      };

      setFestival(loadedFestival);
    } catch (error) {
      console.error("Error loading festival from Supabase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FestivalContext.Provider
      value={{
        festival,
        setFestival,
        updateArtistPriority,
        updateContactInfo,
        clearFestival,
        saveFestivalToSupabase,
        loadFestivalFromSupabase,
        isLoading,
      }}
    >
      {children}
    </FestivalContext.Provider>
  );
}

export function useFestival() {
  const context = useContext(FestivalContext);
  if (context === undefined) {
    throw new Error("useFestival must be used within a FestivalProvider");
  }
  return context;
}

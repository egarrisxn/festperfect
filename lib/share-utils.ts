import { supabase } from "./supabase";
import { Festival } from "@/types/festival";

export async function createShareLink(
  festival: Festival
): Promise<string | null> {
  try {
    const shareId = generateShareId();

    const festivalId = await saveFestivalToSupabase(festival);

    if (!festivalId) {
      console.error("Failed to save festival");
      return null;
    }

    const { error } = await supabase.from("shared_plans").insert({
      share_id: shareId,
      festival_id: festivalId,
    });

    if (error) {
      console.error("Error creating share link:", error);
      return null;
    }

    return shareId;
  } catch (error) {
    console.error("Error in createShareLink:", error);
    return null;
  }
}

export async function loadSharedFestival(
  shareId: string
): Promise<Festival | null> {
  try {
    const { data: sharedPlan, error: sharedError } = await supabase
      .from("shared_plans")
      .select("festival_id")
      .eq("share_id", shareId)
      .maybeSingle();

    if (sharedError || !sharedPlan) {
      console.error("Shared plan not found:", sharedError);
      return null;
    }

    const { data: festivalData, error: festivalError } = await supabase
      .from("festivals")
      .select("*")
      .eq("id", sharedPlan.festival_id)
      .maybeSingle();

    if (festivalError || !festivalData) {
      console.error("Festival not found:", festivalError);
      return null;
    }

    const { data: daysData } = await supabase
      .from("festival_days")
      .select("*")
      .eq("festival_id", festivalData.id);

    const { data: artistsData } = await supabase
      .from("artist_slots")
      .select("*")
      .eq("festival_id", festivalData.id);

    const { data: contactData } = await supabase
      .from("contact_info")
      .select("*")
      .eq("festival_id", festivalData.id)
      .maybeSingle();

    const days = await Promise.all(
      (daysData || []).map(async (day) => {
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

    const artists = (artistsData || []).map((artist) => ({
      id: artist.id,
      artistName: artist.artist_name,
      stageId: artist.stage_id,
      startTime: artist.start_time,
      endTime: artist.end_time,
      priority: artist.priority as "must" | "maybe" | "skip",
      dayId: artist.festival_day_id,
    }));

    const festival: Festival = {
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

    return festival;
  } catch (error) {
    console.error("Error loading shared festival:", error);
    return null;
  }
}

function generateShareId(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function saveFestivalToSupabase(
  festival: Festival
): Promise<string | null> {
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
      .select("id, name, festival_day_id");

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
}

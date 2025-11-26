"use client";

import { useFestival } from "@/contexts/FestivalContext";
import { useRouter } from "next/navigation";
import { ArtistSlot } from "@/types/festival";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/ShareButton";

export default function PlannerPage() {
  const router = useRouter();
  const { festival, updateArtistPriority, isLoading } = useFestival();

  if (isLoading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600'>Loading your festival...</p>
        </div>
      </div>
    );
  }

  if (!festival) {
    return (
      <div className='mx-auto max-w-2xl px-4 py-16 text-center'>
        <AlertCircle className='mx-auto mb-4 size-16 text-gray-400' />
        <h2 className='mb-2 text-2xl font-bold'>No Festival Found</h2>
        <p className='mb-6 text-gray-600'>
          Create a festival to start planning your schedule
        </p>
        <div className='flex justify-center gap-3'>
          <Button onClick={() => router.push("/")}>Go Home</Button>
          <Button variant='outline' onClick={() => router.push("/setup")}>
            Create Festival
          </Button>
        </div>
      </div>
    );
  }

  const day = festival.days[0];
  const dayArtists = festival.artists.filter((a) => a.dayId === day.id);

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const allTimes = dayArtists.flatMap((a) => [
    parseTime(a.startTime),
    parseTime(a.endTime),
  ]);
  const minTime = Math.min(...allTimes);
  const maxTime = Math.max(...allTimes);

  // const generateTimeSlots = () => {
  //   const slots = [];
  //   for (let time = minTime; time <= maxTime; time += 60) {
  //     const hours = Math.floor(time / 60);
  //     const minutes = time % 60;
  //     const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  //     slots.push(timeString);
  //   }
  //   return slots;
  // };

  // const timeSlots = generateTimeSlots();

  const getArtistsByStage = (stageId: string) => {
    return dayArtists
      .filter((a) => a.stageId === stageId)
      .sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
  };

  const cyclePriority = (
    artistId: string,
    currentPriority: ArtistSlot["priority"]
  ) => {
    const priorities: ArtistSlot["priority"][] = ["maybe", "must", "skip"];
    const currentIndex = priorities.indexOf(currentPriority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    updateArtistPriority(artistId, priorities[nextIndex]);
  };

  const getPriorityColor = (priority: ArtistSlot["priority"]) => {
    switch (priority) {
      case "must":
        return "neon-border-green hover:neon-glow-cyan";
      case "maybe":
        return "border-yellow-500/50 hover:border-yellow-500";
      case "skip":
        return "border-gray-600/50 opacity-50 hover:opacity-70";
    }
  };

  const getPriorityBadge = (priority: ArtistSlot["priority"]) => {
    switch (priority) {
      case "must":
        return (
          <Badge className='bg-green-500 font-bold text-black'>Must See</Badge>
        );
      case "maybe":
        return (
          <Badge className='bg-yellow-500 font-bold text-black'>Maybe</Badge>
        );
      case "skip":
        return (
          <Badge variant='outline' className='border-gray-500 text-gray-400'>
            Skip
          </Badge>
        );
    }
  };

  const mustSeeCount = dayArtists.filter((a) => a.priority === "must").length;
  const maybeCount = dayArtists.filter((a) => a.priority === "maybe").length;

  const checkConflicts = (artist: ArtistSlot) => {
    const mustSeeArtists = dayArtists.filter(
      (a) =>
        a.priority === "must" &&
        a.id !== artist.id &&
        a.stageId !== artist.stageId
    );

    return mustSeeArtists.some((other) => {
      const artistStart = parseTime(artist.startTime);
      const artistEnd = parseTime(artist.endTime);
      const otherStart = parseTime(other.startTime);
      const otherEnd = parseTime(other.endTime);

      return artistStart < otherEnd && artistEnd > otherStart;
    });
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-900 via-slate-900 to-black'>
      <div className='mx-auto max-w-7xl px-4 py-8'>
        <div className='mb-8'>
          <div className='mb-6 flex flex-col md:flex-row md:items-center md:justify-between'>
            <div>
              <h1 className='mb-2 bg-linear-to-r from-pink-400 to-cyan-400 bg-clip-text text-4xl font-black text-transparent'>
                {festival.name}
              </h1>
              <div className='flex items-center text-gray-300'>
                <Calendar className='mr-2 size-5 text-cyan-400' />
                <span className='font-medium'>
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div className='mt-4 flex gap-3 md:mt-0'>
              <ShareButton />
              <Button
                onClick={() => router.push("/wallpaper")}
                size='lg'
                className='neon-glow-pink bg-linear-to-r from-pink-500 to-purple-600 font-bold text-white hover:from-pink-600 hover:to-purple-700'
              >
                Create Wallpaper
              </Button>
            </div>
          </div>

          <div className='flex gap-6 text-sm font-medium'>
            <div className='flex items-center gap-2'>
              <div className='neon-glow-cyan size-4 rounded-full bg-green-500'></div>
              <span className='text-white'>Must See: {mustSeeCount}</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='size-4 rounded-full bg-yellow-500'></div>
              <span className='text-white'>Maybe: {maybeCount}</span>
            </div>
          </div>
        </div>

        <div className='glass-strong mb-6 rounded-xl border border-cyan-500/30 p-4'>
          <p className='text-sm font-medium text-cyan-400'>
            <strong className='text-white'>Tap any artist</strong> to cycle
            between Maybe → Must See → Skip
          </p>
        </div>

        <div className='mb-8 hidden gap-4 lg:grid lg:grid-cols-4'>
          {day.stages.map((stage) => {
            const stageArtists = getArtistsByStage(stage.id);
            return (
              <div key={stage.id}>
                <div className='glass-strong mb-3 rounded-t-xl border-b-2 border-pink-500 p-3'>
                  <h3 className='text-center text-lg font-black text-white'>
                    {stage.name}
                  </h3>
                </div>
                <div className='space-y-3'>
                  {stageArtists.map((artist) => {
                    const hasConflict =
                      artist.priority === "must" && checkConflicts(artist);
                    return (
                      <Card
                        key={artist.id}
                        className={cn(
                          "glass-strong cursor-pointer border-2 transition-all",
                          getPriorityColor(artist.priority),
                          hasConflict && "ring-2 ring-red-500"
                        )}
                        onClick={() =>
                          cyclePriority(artist.id, artist.priority)
                        }
                      >
                        <CardContent className='p-4'>
                          <div className='mb-2 text-sm font-bold text-white'>
                            {artist.artistName}
                          </div>
                          <div className='mb-3 text-xs font-medium text-gray-300'>
                            {artist.startTime} - {artist.endTime}
                          </div>
                          <div className='flex items-center justify-between'>
                            {getPriorityBadge(artist.priority)}
                            {hasConflict && (
                              <Badge variant='destructive' className='text-xs'>
                                Conflict!
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className='space-y-6 lg:hidden'>
          {day.stages.map((stage) => {
            const stageArtists = getArtistsByStage(stage.id);
            return (
              <Card key={stage.id} className='glass-strong border-pink-500/30'>
                <CardHeader>
                  <CardTitle className='text-xl font-black text-white'>
                    {stage.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {stageArtists.length === 0 ? (
                    <p className='text-sm text-gray-400'>
                      No artists scheduled
                    </p>
                  ) : (
                    stageArtists.map((artist) => {
                      const hasConflict =
                        artist.priority === "must" && checkConflicts(artist);
                      return (
                        <Card
                          key={artist.id}
                          className={cn(
                            "glass-strong cursor-pointer border-2 transition-all",
                            getPriorityColor(artist.priority),
                            hasConflict && "ring-2 ring-red-500"
                          )}
                          onClick={() =>
                            cyclePriority(artist.id, artist.priority)
                          }
                        >
                          <CardContent className='p-4'>
                            <div className='mb-2 font-bold text-white'>
                              {artist.artistName}
                            </div>
                            <div className='mb-3 text-sm font-medium text-gray-300'>
                              {artist.startTime} - {artist.endTime}
                            </div>
                            <div className='flex items-center justify-between'>
                              {getPriorityBadge(artist.priority)}
                              {hasConflict && (
                                <Badge
                                  variant='destructive'
                                  className='text-xs'
                                >
                                  Conflict!
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

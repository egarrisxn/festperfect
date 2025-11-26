"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadSharedFestival } from "@/lib/share-utils";
import { Festival, ArtistSlot } from "@/types/festival";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, Loader2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SharedPlanPage() {
  const params = useParams();
  const router = useRouter();
  const shareId = params.shareId as string;

  const [festival, setFestival] = useState<Festival | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadFestival() {
      if (!shareId) return;

      const loadedFestival = await loadSharedFestival(shareId);

      if (loadedFestival) {
        setFestival(loadedFestival);
      } else {
        setError(true);
      }

      setIsLoading(false);
    }

    loadFestival();
  }, [shareId]);

  if (isLoading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='mx-auto mb-4 size-12 animate-spin text-blue-600' />
          <p className='text-gray-600'>Loading shared festival plan...</p>
        </div>
      </div>
    );
  }

  if (error || !festival) {
    return (
      <div className='mx-auto max-w-2xl px-4 py-16 text-center'>
        <AlertCircle className='mx-auto mb-4 size-16 text-red-500' />
        <h2 className='mb-2 text-2xl font-bold'>Plan Not Found</h2>
        <p className='mb-6 text-gray-600'>
          This shared plan could not be loaded. It may have been deleted or the
          link is invalid.
        </p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  const day = festival.days[0];
  const dayArtists = festival.artists.filter((a) => a.dayId === day.id);

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getArtistsByStage = (stageId: string) => {
    return dayArtists
      .filter((a) => a.stageId === stageId)
      .sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
  };

  const getPriorityColor = (priority: ArtistSlot["priority"]) => {
    switch (priority) {
      case "must":
        return "bg-green-100 border-green-500 text-green-900";
      case "maybe":
        return "bg-yellow-100 border-yellow-500 text-yellow-900";
      case "skip":
        return "bg-gray-100 border-gray-400 text-gray-600 opacity-60";
    }
  };

  const getPriorityBadge = (priority: ArtistSlot["priority"]) => {
    switch (priority) {
      case "must":
        return <Badge className='bg-green-600'>Must See</Badge>;
      case "maybe":
        return <Badge className='bg-yellow-600'>Maybe</Badge>;
      case "skip":
        return <Badge variant='outline'>Skip</Badge>;
    }
  };

  const mustSeeCount = dayArtists.filter((a) => a.priority === "must").length;
  const maybeCount = dayArtists.filter((a) => a.priority === "maybe").length;

  return (
    <div className='mx-auto max-w-7xl px-4 py-8'>
      <div className='mb-6 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4'>
        <Share2 className='size-5 shrink-0 text-blue-600' />
        <div className='flex-1'>
          <p className='font-semibold text-blue-900'>Shared Festival Plan</p>
          <p className='text-sm text-blue-700'>
            {`This is a read-only view of someone's festival schedule`}
          </p>
        </div>
      </div>

      <div className='mb-6'>
        <div className='mb-4 flex flex-col md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='mb-2 text-3xl font-bold'>{festival.name}</h1>
            <div className='flex items-center text-gray-600'>
              <Calendar className='mr-2 size-4' />
              <span>
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <Button
            onClick={() => router.push("/")}
            size='lg'
            className='mt-4 md:mt-0'
          >
            Create Your Own Festival
          </Button>
        </div>

        <div className='flex gap-4 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='size-3 rounded-full bg-green-600'></div>
            <span>Must See: {mustSeeCount}</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='size-3 rounded-full bg-yellow-600'></div>
            <span>Maybe: {maybeCount}</span>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        {day.stages.map((stage) => {
          const stageArtists = getArtistsByStage(stage.id);
          return (
            <Card key={stage.id}>
              <CardHeader>
                <CardTitle className='text-lg'>{stage.name}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {stageArtists.length === 0 ? (
                  <p className='text-sm text-gray-500'>No artists scheduled</p>
                ) : (
                  stageArtists.map((artist) => (
                    <Card
                      key={artist.id}
                      className={cn(
                        "border-2",
                        getPriorityColor(artist.priority)
                      )}
                    >
                      <CardContent className='p-4'>
                        <div className='mb-1 font-semibold'>
                          {artist.artistName}
                        </div>
                        <div className='mb-2 text-sm text-gray-600'>
                          {artist.startTime} - {artist.endTime}
                        </div>
                        <div>{getPriorityBadge(artist.priority)}</div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

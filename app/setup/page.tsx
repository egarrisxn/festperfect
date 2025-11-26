"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFestival } from "@/contexts/FestivalContext";
import { Festival, Stage, ArtistSlot } from "@/types/festival";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, Upload, Loader2, Sparkles } from "lucide-react";
import { extractLineupFromImage } from "@/lib/ai-extract-lineup";

export default function SetupPage() {
  const router = useRouter();
  const { setFestival } = useFestival();

  const [festivalName, setFestivalName] = useState("");
  const [festivalDate, setFestivalDate] = useState("");
  const [stages, setStages] = useState<Stage[]>([]);
  const [artists, setArtists] = useState<Omit<ArtistSlot, "id" | "dayId">[]>(
    []
  );

  const [newStageName, setNewStageName] = useState("");
  const [newArtist, setNewArtist] = useState({
    artistName: "",
    stageId: "",
    startTime: "",
    endTime: "",
    priority: "maybe" as const,
  });

  const [isExtracting, setIsExtracting] = useState(false);
  // const [extractionMethod, setExtractionMethod] = useState<"upload" | "url">(
  //   "upload"
  // );

  const addStage = () => {
    if (!newStageName.trim()) {
      toast.error("Error", {
        description: "Please enter a stage name",
      });
      return;
    }

    const newStage: Stage = {
      id: `stage-${Date.now()}`,
      name: newStageName,
    };

    setStages([...stages, newStage]);
    setNewStageName("");
  };

  const removeStage = (stageId: string) => {
    setStages(stages.filter((s) => s.id !== stageId));
    setArtists(artists.filter((a) => a.stageId !== stageId));
  };

  const addArtist = () => {
    if (!newArtist.artistName.trim()) {
      toast.error("Error", {
        description: "Please enter an artist name",
      });
      return;
    }

    if (!newArtist.stageId) {
      toast.error("Error", {
        description: "Please select a stage",
      });
      return;
    }

    if (!newArtist.startTime || !newArtist.endTime) {
      toast.error("Error", {
        description: "Please enter start and end times",
      });
      return;
    }

    setArtists([...artists, { ...newArtist }]);
    setNewArtist({
      artistName: "",
      stageId: "",
      startTime: "",
      endTime: "",
      priority: "maybe",
    });
  };

  const removeArtist = (index: number) => {
    setArtists(artists.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!festivalName.trim()) {
      toast.error("Error", {
        description: "Please enter a festival name",
      });
      return;
    }

    if (!festivalDate) {
      toast.error("Error", {
        description: "Please select a festival date",
      });
      return;
    }

    if (stages.length === 0) {
      toast.error("Error", {
        description: "Please add at least one stage",
      });
      return;
    }

    const dayId = `day-${Date.now()}`;

    const festival: Festival = {
      id: `festival-${Date.now()}`,
      name: festivalName,
      days: [
        {
          id: dayId,
          date: festivalDate,
          stages,
        },
      ],
      artists: artists.map((artist, index) => ({
        ...artist,
        id: `artist-${Date.now()}-${index}`,
        dayId,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFestival(festival);

    toast.success("Festival created successfully!");

    router.push("/planner");
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);

    const extracted = await extractLineupFromImage(file);

    if (extracted) {
      if (extracted.festivalName) setFestivalName(extracted.festivalName);
      if (extracted.date) setFestivalDate(extracted.date);

      const newStages: Stage[] = extracted.stages.map((stage, idx) => ({
        id: `stage-${Date.now()}-${idx}`,
        name: stage.name,
      }));

      setStages(newStages);

      const newArtists: Omit<ArtistSlot, "id" | "dayId">[] = [];
      extracted.stages.forEach((stage, stageIdx) => {
        const stageId = newStages[stageIdx].id;
        stage.artists.forEach((artist) => {
          newArtists.push({
            artistName: artist.name,
            stageId,
            startTime: artist.startTime || "14:00",
            endTime: artist.endTime || "15:00",
            priority: "maybe",
          });
        });
      });

      setArtists(newArtists);

      toast.success("Success!", {
        description: `Extracted ${newArtists.length} artists from the image`,
      });
    } else {
      toast.error("Extraction Failed", {
        description: "Could not extract lineup from image. Try manual entry.",
      });
    }

    setIsExtracting(false);
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-900 via-slate-900 to-black'>
      <div className='mx-auto max-w-4xl px-4 py-8'>
        <div className='mb-8'>
          <h1 className='mb-2 bg-linear-to-r from-pink-400 to-cyan-400 bg-clip-text text-4xl font-black text-transparent'>
            Create Your Festival
          </h1>
          <p className='font-medium text-gray-300'>
            Set up your festival details, stages, and artist lineup
          </p>
        </div>

        <div className='space-y-6'>
          <Card className='glass-strong border-2 border-dashed border-cyan-500/50'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Sparkles className='size-5 text-cyan-400' />
                AI Lineup Extraction
              </CardTitle>
              <CardDescription className='text-gray-300'>
                Upload a festival flyer or poster to automatically extract the
                lineup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex w-full items-center justify-center'>
                  <label
                    htmlFor='flyer-upload'
                    className='glass hover:glass-strong flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-cyan-500/50 transition-colors'
                  >
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                      {isExtracting ? (
                        <>
                          <Loader2 className='mb-3 size-10 animate-spin text-cyan-400' />
                          <p className='text-sm text-gray-300'>
                            Extracting lineup with AI...
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className='mb-3 size-10 text-cyan-400' />
                          <p className='mb-2 text-sm text-gray-300'>
                            <span className='font-semibold text-white'>
                              Click to upload
                            </span>{" "}
                            festival flyer
                          </p>
                          <p className='text-xs text-gray-400'>
                            PNG, JPG, or PDF
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      id='flyer-upload'
                      type='file'
                      className='hidden'
                      accept='image/*'
                      onChange={handleImageUpload}
                      disabled={isExtracting}
                    />
                  </label>
                </div>
                <p className='text-center text-xs text-gray-400'>
                  Note: AI extraction requires an OpenAI API key. If extraction
                  fails, you can manually enter the lineup below.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-gray-700' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-gray-900 px-2 text-gray-400'>
                Or enter manually
              </span>
            </div>
          </div>

          <Card className='glass-strong border-pink-500/30'>
            <CardHeader>
              <CardTitle className='text-white'>Festival Details</CardTitle>
              <CardDescription className='text-gray-300'>
                Basic information about your festival
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='festivalName'>Festival Name</Label>
                <Input
                  id='festivalName'
                  placeholder='e.g., Summer Sounds Festival'
                  value={festivalName}
                  onChange={(e) => setFestivalName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor='festivalDate'>Festival Date</Label>
                <Input
                  id='festivalDate'
                  type='date'
                  value={festivalDate}
                  onChange={(e) => setFestivalDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stages</CardTitle>
              <CardDescription>Add the stages at your festival</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex gap-2'>
                <Input
                  placeholder='Stage name (e.g., Main Stage)'
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addStage()}
                />
                <Button onClick={addStage}>
                  <Plus className='mr-1 size-4' />
                  Add
                </Button>
              </div>

              {stages.length > 0 && (
                <div className='space-y-2'>
                  {stages.map((stage) => (
                    <div
                      key={stage.id}
                      className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                    >
                      <span className='font-medium'>{stage.name}</span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => removeStage(stage.id)}
                      >
                        <Trash2 className='size-4 text-red-500' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Artists</CardTitle>
              <CardDescription>Add artists and their set times</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <Input
                  placeholder='Artist name'
                  value={newArtist.artistName}
                  onChange={(e) =>
                    setNewArtist({ ...newArtist, artistName: e.target.value })
                  }
                />

                <Select
                  value={newArtist.stageId}
                  onValueChange={(value) =>
                    setNewArtist({ ...newArtist, stageId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a stage' />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <Label htmlFor='startTime'>Start Time</Label>
                    <Input
                      id='startTime'
                      type='time'
                      value={newArtist.startTime}
                      onChange={(e) =>
                        setNewArtist({
                          ...newArtist,
                          startTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='endTime'>End Time</Label>
                    <Input
                      id='endTime'
                      type='time'
                      value={newArtist.endTime}
                      onChange={(e) =>
                        setNewArtist({ ...newArtist, endTime: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button onClick={addArtist} className='w-full'>
                  <Plus className='mr-1 size-4' />
                  Add Artist
                </Button>
              </div>

              {artists.length > 0 && (
                <div className='mt-4 space-y-2'>
                  <h4 className='text-sm font-semibold text-gray-600'>
                    Added Artists ({artists.length})
                  </h4>
                  {artists.map((artist, index) => {
                    const stage = stages.find((s) => s.id === artist.stageId);
                    return (
                      <div
                        key={index}
                        className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                      >
                        <div className='flex-1'>
                          <div className='font-medium'>{artist.artistName}</div>
                          <div className='text-sm text-gray-600'>
                            {stage?.name} • {artist.startTime} -{" "}
                            {artist.endTime}
                          </div>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => removeArtist(index)}
                        >
                          <Trash2 className='size-4 text-red-500' />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className='flex gap-3'>
            <Button
              onClick={handleSave}
              size='lg'
              className='neon-glow-pink flex-1 bg-linear-to-r from-pink-500 to-purple-600 font-bold text-white hover:from-pink-600 hover:to-purple-700'
            >
              <Save className='mr-2 size-4' />
              Save and Go to Planner
            </Button>
            <Button
              variant='outline'
              onClick={() => router.push("/")}
              size='lg'
              className='border-cyan-500 text-cyan-400 hover:bg-cyan-500/20'
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

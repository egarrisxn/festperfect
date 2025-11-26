"use client";

import { useRouter } from "next/navigation";
import { useFestival } from "@/contexts/FestivalContext";
import { generateDemoFestival } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music, Calendar, Image, Share2, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { festival, setFestival } = useFestival();

  const handleUseDemoLineup = () => {
    const demoFestival = generateDemoFestival();
    setFestival(demoFestival);
    router.push("/planner");
  };

  const handleCreateOwn = () => {
    router.push("/setup");
  };

  const handleContinue = () => {
    router.push("/planner");
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-linear-to-br from-gray-900 via-slate-900 to-black'>
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-20 left-10 h-96 w-96 animate-pulse rounded-full bg-pink-500/20 blur-3xl filter'></div>
        <div
          className='absolute top-40 right-10 h-96 w-96 animate-pulse rounded-full bg-cyan-500/20 blur-3xl filter'
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className='absolute bottom-20 left-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl filter'
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className='absolute top-1/3 right-1/4 h-96 w-96 animate-pulse rounded-full bg-green-500/10 blur-3xl filter'
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className='relative mx-auto max-w-6xl px-4 py-12 md:py-20'>
        <div className='mb-16 text-center'>
          <div className='mb-8 flex justify-center'>
            <div className='group relative'>
              <div className='absolute inset-0 animate-pulse rounded-3xl bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-75 blur-2xl transition-opacity group-hover:opacity-100'></div>
              <div className='glass-strong neon-border-pink relative transform rounded-3xl p-8 transition-all group-hover:scale-110'>
                <Music className='h-20 w-20 text-pink-400' strokeWidth={2} />
              </div>
            </div>
          </div>

          <h1 className='mb-8 text-6xl font-black tracking-tighter md:text-8xl'>
            <span className='neon-pink bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent'>
              FestPerfect
            </span>
          </h1>

          <p className='mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl'>
            Your Festival.{" "}
            <span className='bg-linear-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent'>
              Perfected.
            </span>
          </p>

          <p className='mx-auto max-w-2xl text-lg leading-relaxed font-medium text-gray-300'>
            Plan your festival schedule, never miss your favorite artists, and
            create a lock screen wallpaper with emergency contact info.
          </p>
        </div>

        {festival ? (
          <Card className='glass-strong neon-border-cyan mb-12 transform shadow-2xl transition-all hover:scale-[1.02]'>
            <CardHeader>
              <CardTitle className='flex items-center text-2xl font-black text-white'>
                <Calendar
                  className='mr-3 size-6 text-cyan-400'
                  strokeWidth={2.5}
                />
                Current Festival: {festival.name}
              </CardTitle>
              <CardDescription className='text-base font-medium text-gray-300'>
                You have an active festival plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button
                  onClick={handleContinue}
                  size='lg'
                  className='neon-glow-pink flex-1 bg-linear-to-r from-pink-500 to-purple-600 py-6 text-lg font-bold text-white hover:from-pink-600 hover:to-purple-700'
                >
                  Continue Planning
                </Button>
                <Button
                  onClick={handleCreateOwn}
                  variant='outline'
                  size='lg'
                  className='glass flex-1 border-2 border-cyan-500 py-6 text-lg font-bold text-cyan-400 hover:bg-cyan-500/20'
                >
                  Start New Festival
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='mb-16 grid gap-8 md:grid-cols-2'>
            <Card
              className='group glass-strong neon-border-green transform cursor-pointer transition-all hover:scale-105 hover:-rotate-1 hover:shadow-2xl'
              onClick={handleUseDemoLineup}
            >
              <CardHeader>
                <CardTitle className='flex items-center text-2xl font-black text-white'>
                  <Zap
                    className='mr-3 size-7 text-green-400'
                    strokeWidth={2.5}
                  />
                  Try Demo Lineup
                </CardTitle>
                <CardDescription className='text-base font-medium text-gray-300'>
                  Explore FestPerfect with a pre-loaded festival schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className='neon-glow-cyan w-full bg-linear-to-r from-green-500 to-cyan-500 py-6 text-lg font-bold text-black hover:from-green-600 hover:to-cyan-600'
                  size='lg'
                >
                  Load Demo Festival
                </Button>
              </CardContent>
            </Card>

            <Card
              className='group glass-strong neon-border-purple transform cursor-pointer transition-all hover:scale-105 hover:rotate-1 hover:shadow-2xl'
              onClick={handleCreateOwn}
            >
              <CardHeader>
                <CardTitle className='flex items-center text-2xl font-black text-white'>
                  <Music
                    className='mr-3 size-7 text-purple-400'
                    strokeWidth={2.5}
                  />
                  Create Your Own
                </CardTitle>
                <CardDescription className='text-base font-medium text-gray-300'>
                  Set up a custom lineup for your festival
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className='neon-glow-pink w-full bg-linear-to-r from-purple-500 to-pink-500 py-6 text-lg font-bold text-white hover:from-purple-600 hover:to-pink-600'
                  size='lg'
                >
                  Start From Scratch
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className='mb-16 grid gap-6 md:grid-cols-3'>
          <Card className='glass-strong neon-border-pink hover:neon-glow-pink transition-all'>
            <CardHeader>
              <div className='relative mb-3 w-fit'>
                <div className='absolute inset-0 rounded-2xl bg-pink-500 opacity-50 blur-xl'></div>
                <div className='relative rounded-2xl bg-linear-to-br from-pink-500 to-purple-500 p-4'>
                  <Calendar className='size-7 text-white' strokeWidth={2.5} />
                </div>
              </div>
              <CardTitle className='text-xl font-bold text-white'>
                Smart Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='leading-relaxed font-medium text-gray-300'>
                Organize your festival day with an interactive stage-by-time
                grid. Mark must-see acts and maybes.
              </p>
            </CardContent>
          </Card>

          <Card className='glass-strong neon-border-cyan hover:neon-glow-cyan transition-all'>
            <CardHeader>
              <div className='relative mb-3 w-fit'>
                <div className='absolute inset-0 rounded-2xl bg-cyan-500 opacity-50 blur-xl'></div>
                <div className='relative rounded-2xl bg-linear-to-br from-cyan-500 to-blue-500 p-4'>
                  <Image className='size-7 text-white' strokeWidth={2.5} />
                </div>
              </div>
              <CardTitle className='text-xl font-bold text-white'>
                Lock Screen Wallpaper
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='leading-relaxed font-medium text-gray-300'>
                Generate a high-contrast wallpaper with your schedule and QR
                code for emergency contacts.
              </p>
            </CardContent>
          </Card>

          <Card className='glass-strong neon-border-green hover:neon-glow-multi transition-all'>
            <CardHeader>
              <div className='relative mb-3 w-fit'>
                <div className='absolute inset-0 rounded-2xl bg-green-500 opacity-50 blur-xl'></div>
                <div className='relative rounded-2xl bg-linear-to-br from-green-500 to-teal-500 p-4'>
                  <Share2 className='size-7 text-white' strokeWidth={2.5} />
                </div>
              </div>
              <CardTitle className='text-xl font-bold text-white'>
                Share Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='leading-relaxed font-medium text-gray-300'>
                Share your festival plan with friends and see who wants to catch
                the same shows.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className='glass-strong neon-border-purple'>
          <CardHeader>
            <CardTitle className='text-center text-3xl font-black text-white'>
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-8 text-center md:grid-cols-4'>
              <div>
                <div className='group relative mx-auto mb-4 h-20 w-20'>
                  <div className='absolute inset-0 rounded-2xl bg-pink-500 opacity-75 blur-xl transition-opacity group-hover:opacity-100'></div>
                  <div className='relative flex transform items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 to-purple-500 p-5 transition-transform group-hover:scale-110'>
                    <span className='text-3xl font-black text-white'>1</span>
                  </div>
                </div>
                <h3 className='mb-2 text-lg font-black text-white'>Set Up</h3>
                <p className='text-sm font-medium text-gray-300'>
                  Add your festival details, stages, and artist lineup
                </p>
              </div>
              <div>
                <div className='group relative mx-auto mb-4 h-20 w-20'>
                  <div className='absolute inset-0 rounded-2xl bg-purple-500 opacity-75 blur-xl transition-opacity group-hover:opacity-100'></div>
                  <div className='relative flex transform items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 p-5 transition-transform group-hover:scale-110'>
                    <span className='text-3xl font-black text-white'>2</span>
                  </div>
                </div>
                <h3 className='mb-2 text-lg font-black text-white'>Plan</h3>
                <p className='text-sm font-medium text-gray-300'>
                  Mark your must-see artists and resolve scheduling conflicts
                </p>
              </div>
              <div>
                <div className='group relative mx-auto mb-4 h-20 w-20'>
                  <div className='absolute inset-0 rounded-2xl bg-cyan-500 opacity-75 blur-xl transition-opacity group-hover:opacity-100'></div>
                  <div className='relative flex transform items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-green-500 p-5 transition-transform group-hover:scale-110'>
                    <span className='text-3xl font-black text-white'>3</span>
                  </div>
                </div>
                <h3 className='mb-2 text-lg font-black text-white'>Save</h3>
                <p className='text-sm font-medium text-gray-300'>
                  Create a lock screen wallpaper with your schedule
                </p>
              </div>
              <div>
                <div className='group relative mx-auto mb-4 h-20 w-20'>
                  <div className='absolute inset-0 rounded-2xl bg-green-500 opacity-75 blur-xl transition-opacity group-hover:opacity-100'></div>
                  <div className='relative flex transform items-center justify-center rounded-2xl bg-linear-to-br from-green-500 to-yellow-500 p-5 transition-transform group-hover:scale-110'>
                    <span className='text-3xl font-black text-white'>4</span>
                  </div>
                </div>
                <h3 className='mb-2 text-lg font-black text-white'>Share</h3>
                <p className='text-sm font-medium text-gray-300'>
                  Share your plan with friends attending the festival
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

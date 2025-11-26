"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music2, Calendar, Image, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Music2 },
    { href: "/planner", label: "Planner", icon: Calendar },
    { href: "/wallpaper", label: "Wallpaper", icon: Image },
    { href: "/setup", label: "Setup", icon: Sparkles },
  ];

  return (
    <nav className='glass-strong sticky top-0 z-50 border-b border-pink-500/30 backdrop-blur-xl'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <Link href='/' className='group flex items-center space-x-3'>
            <div className='relative'>
              <div className='absolute inset-0 rounded-2xl bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-75 blur-lg transition-opacity group-hover:opacity-100'></div>
              <div className='relative transform rounded-2xl bg-linear-to-br from-pink-500 via-purple-600 to-cyan-500 p-3 transition-transform group-hover:scale-110'>
                <Music2 className='size-6 text-white' strokeWidth={2.5} />
              </div>
            </div>
            <span className='bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-2xl font-black tracking-tight text-transparent'>
              FestPerfect
            </span>
          </Link>

          <div className='hidden space-x-2 md:flex'>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex transform items-center rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105",
                    isActive
                      ? "glass-strong neon-border-pink text-white"
                      : "hover:glass text-gray-300 hover:text-white"
                  )}
                >
                  <Icon className='mr-2 size-4' strokeWidth={2.5} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className='flex space-x-4 md:hidden'>
            {links.slice(1, 3).map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md p-2",
                    pathname === link.href
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  <Icon className='size-5' />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className='glass border-t border-pink-500/20 md:hidden'>
        <div className='flex justify-around py-3'>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center rounded-xl px-3 py-2 text-xs font-bold transition-all",
                  isActive ? "scale-110 text-pink-400" : "text-gray-400"
                )}
              >
                <Icon className='mb-1 size-6' strokeWidth={2.5} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

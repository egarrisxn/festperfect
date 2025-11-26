"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFestival } from "@/contexts/FestivalContext";
// import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Info, Download, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type DeviceSize = {
  name: string;
  width: number;
  height: number;
  label: string;
};

const DEVICE_SIZES: DeviceSize[] = [
  { name: "iphone-14-pro", width: 1179, height: 2556, label: "iPhone 14 Pro" },
  { name: "iphone-se", width: 750, height: 1334, label: "iPhone SE/8" },
  {
    name: "android-standard",
    width: 1080,
    height: 2340,
    label: "Android (Standard)",
  },
  {
    name: "android-large",
    width: 1440,
    height: 3200,
    label: "Android (Large)",
  },
];

export default function WallpaperPage() {
  const router = useRouter();
  const { festival, updateContactInfo } = useFestival();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [alternateContact, setAlternateContact] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<DeviceSize>(
    DEVICE_SIZES[0]
  );

  useEffect(() => {
    if (festival?.contactInfo) {
      setContactName(festival.contactInfo.name);
      setContactPhone(festival.contactInfo.phone);
      setAlternateContact(festival.contactInfo.alternateContact || "");
    }
  }, [festival]);

  if (!festival) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-slate-900 to-black'>
        <div className='mx-auto max-w-2xl px-4 py-16 text-center'>
          <AlertCircle className='mx-auto mb-4 size-16 text-gray-400' />
          <h2 className='mb-2 text-2xl font-bold text-white'>
            No Festival Found
          </h2>
          <p className='mb-6 text-gray-300'>
            Create a festival to generate your wallpaper
          </p>
          <div className='flex justify-center gap-3'>
            <Button
              onClick={() => router.push("/")}
              className='bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
            >
              Go Home
            </Button>
            <Button
              variant='outline'
              onClick={() => router.push("/setup")}
              className='border-cyan-500 text-cyan-400 hover:bg-cyan-500/20'
            >
              Create Festival
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const day = festival.days[0];
  const mustSeeArtists = festival.artists
    .filter((a) => a.priority === "must" && a.dayId === day.id)
    .sort((a, b) => {
      const parseTime = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };
      return parseTime(a.startTime) - parseTime(b.startTime);
    });

  const maybeArtists = festival.artists
    .filter((a) => a.priority === "maybe" && a.dayId === day.id)
    .sort((a, b) => {
      const parseTime = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };
      return parseTime(a.startTime) - parseTime(b.startTime);
    });

  const getStageNameById = (stageId: string) => {
    return day.stages.find((s) => s.id === stageId)?.name || "Unknown Stage";
  };

  const qrData = `If found, please contact:
${contactName || "Owner"}
Phone: ${contactPhone || "Not provided"}
${alternateContact ? "Alt: " + alternateContact : ""}`;

  const handleSaveContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      toast.error("Error", {
        description: "Please enter both name and phone number",
      });
      return;
    }

    updateContactInfo({
      name: contactName,
      phone: contactPhone,
      alternateContact: alternateContact || undefined,
    });

    toast.success("Contact information updated");

    setIsEditing(false);
  };

  const handleDownloadWallpaper = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = selectedDevice.width;
    canvas.height = selectedDevice.height;

    // Background gradient
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(0.5, "#1e293b");
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = selectedDevice.width / 400;
    const padding = 40 * scale;
    let yPos = padding;

    // Festival Name
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${32 * scale}px Inter`;
    ctx.textAlign = "center";
    const gradient2 = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient2.addColorStop(0, "#f472b6");
    gradient2.addColorStop(0.5, "#a78bfa");
    gradient2.addColorStop(1, "#22d3ee");
    ctx.fillStyle = gradient2;
    ctx.fillText(festival.name, canvas.width / 2, yPos);
    yPos += 40 * scale;

    // Date
    ctx.fillStyle = "#d1d5db";
    ctx.font = `${16 * scale}px Inter`;
    ctx.fillText(
      new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      canvas.width / 2,
      yPos
    );
    yPos += 60 * scale;

    // MUST SEE section
    if (mustSeeArtists.length > 0) {
      ctx.fillStyle = "#22c55e";
      ctx.font = `bold ${14 * scale}px Inter`;
      ctx.textAlign = "left";
      ctx.fillText("MUST SEE", padding, yPos);
      yPos += 30 * scale;

      ctx.fillStyle = "#ffffff";
      ctx.font = `${12 * scale}px Inter`;
      mustSeeArtists.slice(0, 8).forEach((artist) => {
        ctx.fillText(`${artist.artistName}`, padding, yPos);
        yPos += 20 * scale;
        ctx.fillStyle = "#9ca3af";
        ctx.fillText(
          `${artist.startTime} - ${artist.endTime} • ${getStageNameById(
            artist.stageId
          )}`,
          padding,
          yPos
        );
        yPos += 30 * scale;
        ctx.fillStyle = "#ffffff";
      });
      yPos += 20 * scale;
    }

    // MAYBE section
    if (maybeArtists.length > 0) {
      ctx.fillStyle = "#eab308";
      ctx.font = `bold ${14 * scale}px Inter`;
      ctx.fillText("MAYBE", padding, yPos);
      yPos += 30 * scale;

      ctx.fillStyle = "#ffffff";
      ctx.font = `${11 * scale}px Inter`;
      maybeArtists.slice(0, 5).forEach((artist) => {
        ctx.fillText(
          `${artist.artistName} • ${artist.startTime}`,
          padding,
          yPos
        );
        yPos += 25 * scale;
      });
    }

    // QR container
    const qrSize = 140 * scale;
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = canvas.height - qrSize - 80 * scale;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
      qrX - 10 * scale,
      qrY - 10 * scale,
      qrSize + 20 * scale,
      qrSize + 50 * scale
    );

    // QR code generation
    try {
      const QRCode = await import("qrcode");
      const qrDataUrl = await QRCode.toDataURL(qrData, {
        width: qrSize,
        margin: 0,
      });
      const qrImage = new Image();
      await new Promise<void>((resolve, reject) => {
        qrImage.onload = () => resolve();
        qrImage.onerror = () => reject(new Error("Failed to load QR image"));
        qrImage.src = qrDataUrl;
      });
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    }

    // QR caption
    ctx.fillStyle = "#000000";
    ctx.font = `bold ${12 * scale}px Inter`;
    ctx.textAlign = "center";
    ctx.fillText(
      "If found, scan QR",
      canvas.width / 2,
      qrY + qrSize + 30 * scale
    );

    // Download image
    const link = document.createElement("a");
    link.download = `${festival.name.replace(
      /\s+/g,
      "-"
    )}-wallpaper-${selectedDevice.name}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast.success("Wallpaper downloaded successfully!");
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-900 via-slate-900 to-black'>
      <div className='mx-auto max-w-6xl px-4 py-8'>
        <div className='mb-8'>
          <h1 className='mb-2 bg-linear-to-r from-pink-400 to-cyan-400 bg-clip-text text-4xl font-black text-transparent'>
            Festival Wallpaper
          </h1>
          <p className='font-medium text-gray-300'>
            Screenshot this view for your phone lock screen
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-2'>
          <div>
            <Card className='glass-strong mb-6 border-cyan-500/30'>
              <CardHeader>
                <CardTitle className='text-white'>
                  Emergency Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='contactName' className='text-gray-300'>
                        Your Name
                      </Label>
                      <Input
                        id='contactName'
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder='John Doe'
                        className='border-gray-600 bg-gray-800/50 text-white'
                      />
                    </div>
                    <div>
                      <Label htmlFor='contactPhone' className='text-gray-300'>
                        Phone Number
                      </Label>
                      <Input
                        id='contactPhone'
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder='+1 (555) 123-4567'
                        className='border-gray-600 bg-gray-800/50 text-white'
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor='alternateContact'
                        className='text-gray-300'
                      >
                        Alternate Contact (Optional)
                      </Label>
                      <Input
                        id='alternateContact'
                        value={alternateContact}
                        onChange={(e) => setAlternateContact(e.target.value)}
                        placeholder='friend@example.com'
                        className='border-gray-600 bg-gray-800/50 text-white'
                      />
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        onClick={handleSaveContact}
                        className='bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                      >
                        Save
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => setIsEditing(false)}
                        className='border-gray-600 text-gray-300 hover:bg-gray-800'
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {contactName || contactPhone ? (
                      <>
                        <div>
                          <div className='text-sm text-gray-400'>Name</div>
                          <div className='font-medium text-white'>
                            {contactName || "Not set"}
                          </div>
                        </div>
                        <div>
                          <div className='text-sm text-gray-400'>Phone</div>
                          <div className='font-medium text-white'>
                            {contactPhone || "Not set"}
                          </div>
                        </div>
                        {alternateContact && (
                          <div>
                            <div className='text-sm text-gray-400'>
                              Alternate Contact
                            </div>
                            <div className='font-medium text-white'>
                              {alternateContact}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className='text-sm text-gray-400'>
                        No contact information set
                      </p>
                    )}
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant='outline'
                      className='w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500/20'
                    >
                      {contactName || contactPhone ? "Edit" : "Add"} Contact
                      Info
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className='glass-strong border-purple-500/30'>
              <CardContent className='pt-6'>
                <div className='flex items-start gap-3'>
                  <Info className='mt-0.5 size-5 shrink-0 text-purple-400' />
                  <div className='text-sm text-gray-300'>
                    <p className='mb-2 font-bold text-white'>How to use:</p>
                    <ol className='list-inside list-decimal space-y-1'>
                      <li>Select your device type below</li>
                      <li>Click Download Wallpaper button</li>
                      <li>Set the downloaded image as your lock screen</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className='glass-strong mb-6 border-cyan-500/30'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-white'>
                  <Smartphone className='size-5 text-cyan-400' />
                  Select Device Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-3'>
                  {DEVICE_SIZES.map((device) => (
                    <button
                      key={device.name}
                      onClick={() => setSelectedDevice(device)}
                      className={cn(
                        "rounded-xl border-2 p-4 text-left transition-all",
                        selectedDevice.name === device.name
                          ? "neon-border-cyan neon-glow-cyan"
                          : "border-gray-600 hover:border-cyan-500/50"
                      )}
                    >
                      <div className='mb-1 text-sm font-bold text-white'>
                        {device.label}
                      </div>
                      <div className='text-xs text-gray-400'>
                        {device.width} × {device.height}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className='glass-strong mb-6 rounded-2xl border-pink-500/30 p-8 text-center'>
              <Smartphone className='mx-auto mb-4 h-20 w-20 text-pink-400' />
              <h3 className='mb-2 text-xl font-black text-white'>
                Download Your Wallpaper
              </h3>
              <p className='mb-6 text-gray-300'>
                Get a custom {selectedDevice.label} wallpaper with your festival
                schedule and QR code
              </p>
              <Button
                onClick={handleDownloadWallpaper}
                size='lg'
                className='neon-glow-pink bg-linear-to-r from-pink-500 to-purple-600 font-bold text-white hover:from-pink-600 hover:to-purple-700'
              >
                <Download className='mr-2 size-5' />
                Download Wallpaper
              </Button>
            </div>

            <div className='text-center'>
              <Button
                onClick={() => router.push("/planner")}
                variant='outline'
                className='border-cyan-500 text-cyan-400 hover:bg-cyan-500/20'
              >
                Back to Planner
              </Button>
            </div>

            <canvas ref={canvasRef} className='hidden' />
          </div>
        </div>
      </div>
    </div>
  );
}

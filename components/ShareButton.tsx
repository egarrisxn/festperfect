"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useFestival } from "@/contexts/FestivalContext";
import { createShareLink } from "@/lib/share-utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check, Loader2 } from "lucide-react";

export function ShareButton() {
  const { festival } = useFestival();
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!festival) return;

    setIsLoading(true);

    const shareId = await createShareLink(festival);

    if (shareId) {
      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);
      toast.success("Share link created!");
    } else {
      toast.error("Failed to create share link", {
        description: "Please try again.",
      });
    }

    setIsLoading(false);
  };

  const handleCopy = async () => {
    if (!shareUrl) return;

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Share link copied to clipboard");

    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setShareUrl("");
      setCopied(false);
      setIsLoading(false);
    }
  };

  if (!festival) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Share2 className='mr-2 size-4' />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Festival Plan</DialogTitle>
          <DialogDescription>
            Create a shareable link that others can view.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {!shareUrl ? (
            <Button
              onClick={handleShare}
              disabled={isLoading}
              className='w-full'
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 size-4 animate-spin' />
                  Creating Link...
                </>
              ) : (
                <>
                  <Share2 className='mr-2 size-4' />
                  Generate Share Link
                </>
              )}
            </Button>
          ) : (
            <div className='space-y-3'>
              <div className='flex gap-2'>
                <Input value={shareUrl} readOnly className='flex-1' />
                <Button onClick={handleCopy} size='icon' variant='outline'>
                  {copied ? (
                    <Check className='size-4 text-green-600' />
                  ) : (
                    <Copy className='size-4' />
                  )}
                </Button>
              </div>
              <p className='text-sm text-gray-600'>
                Anyone with this link can view your festival plan (read-only).
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

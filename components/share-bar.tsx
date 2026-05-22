"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, ImageIcon, Check, Download } from "lucide-react";
import { useBracket } from "@/lib/store";
import { encodePayload } from "@/lib/encode";
import { toPng } from "html-to-image";

export function ShareBar({ exportTargetId }: { exportTargetId: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const name = useBracket((s) => s.name);
  const setName = useBracket((s) => s.setName);
  const toPayload = useBracket((s) => s.toPayload);

  const buildLink = () => {
    if (typeof window === "undefined") return "";
    const encoded = encodePayload(toPayload());
    return `${window.location.origin}/#${encoded}`;
  };

  const copy = async () => {
    const link = buildLink();
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const exportPng = async () => {
    const node = document.getElementById(exportTargetId);
    if (!node) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#F5F2EA",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `world-cup-2026-prediction${name ? `-${name.replace(/\s+/g, "-")}` : ""}.png`;
      a.click();
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full px-6">
          Share my prediction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="display text-2xl font-medium tracking-tight">
            Share your prediction
          </DialogTitle>
          <DialogDescription>
            Anyone with this link can view your bracket and make their own from
            scratch.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Your name (optional)
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Abdulla"
              maxLength={40}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={copy} className="flex-1 gap-2" variant="default">
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Link copied
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4" /> Copy share link
                </>
              )}
            </Button>
            <Button
              onClick={exportPng}
              className="flex-1 gap-2"
              variant="outline"
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <ImageIcon className="h-4 w-4" /> Rendering…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" /> Download image
                </>
              )}
            </Button>
          </div>
        </div>

        <DialogFooter className="text-xs text-muted-foreground">
          Predictions are stored only in your browser and inside the link.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

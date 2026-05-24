"use client";

import { useEffect, useState } from "react";
import { groupLetters } from "@/lib/teams";
import { GroupCard } from "./group-card";
import { ThirdPlacePicker } from "./third-place-picker";
import { KnockoutTree } from "./knockout-tree";
import { AwardsSection } from "./awards-section";
import { ShareBar } from "./share-bar";
import { Wordmark, BrandLine } from "./wordmark";
import { FlagCarousel } from "./flag-carousel";
import { Button } from "./ui/button";
import { useBracket } from "@/lib/store";
import { decodePayload } from "@/lib/encode";
import { ArrowRight, RotateCcw } from "lucide-react";
import { teamById } from "@/lib/teams";
import { Flag } from "./flag";

type Mode = "landing" | "edit" | "view";

export function Builder() {
  const [mode, setMode] = useState<Mode>("landing");
  const [hydrated, setHydrated] = useState(false);
  const loadFromPayload = useBracket((s) => s.loadFromPayload);
  const reset = useBracket((s) => s.reset);
  const name = useBracket((s) => s.name);

  useEffect(() => {
    setHydrated(true);
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      const payload = decodePayload(hash);
      if (payload) {
        loadFromPayload(payload);
        setMode("view");
        return;
      }
    }
  }, [loadFromPayload]);

  if (!hydrated) return null;

  if (mode === "landing") {
    return <Landing onStart={() => setMode("edit")} />;
  }

  if (mode === "view") {
    return (
      <ViewMode
        viewerName={name}
        onMakeOwn={() => {
          reset();
          if (typeof window !== "undefined")
            window.history.replaceState(null, "", window.location.pathname);
          setMode("edit");
        }}
      />
    );
  }

  return <EditMode />;
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col justify-center px-6 py-12 md:px-12">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex flex-col items-start gap-6">
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Canada · Mexico · USA · June 11 to July 19
            </p>
            <h1 className="display text-[15vw] font-light leading-[0.85] tracking-tighter md:text-[12rem]">
              World
              <br />
              <span className="font-extralight">Cup</span>
              <br />
              <span className="text-[var(--accent-red)]">26</span>
            </h1>
            <Button
              size="lg"
              className="mt-2 gap-2 rounded-full px-7 py-6 text-base"
              onClick={onStart}
            >
              Start your prediction
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      <section className="border-t border-border bg-paper">
        <div className="mx-auto max-w-7xl py-6">
          <FlagCarousel />
        </div>
      </section>
    </div>
  );
}

function EditMode() {
  return (
    <div className="min-h-screen">
      <BuilderHeader />
      <div id="bracket-export" className="bg-background pb-32">
        <Section
          step="01"
          title="Group stage"
          subtitle="rank each group 1-4"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupLetters.map((g) => (
              <GroupCard key={g} group={g} />
            ))}
          </div>
        </Section>

        <Section
          step="02"
          title="Best thirds"
          subtitle="pick 8 of 12 to advance"
        >
          <ThirdPlacePicker />
        </Section>

        <Section
          step="03"
          title="Knockouts"
          subtitle="pick a winner in every match"
        >
          <KnockoutTree />
        </Section>

        <Section
          step="04"
          title="Awards"
          subtitle="pick a player or type a name"
        >
          <AwardsSection />
        </Section>
      </div>

      <StickyShare />
    </div>
  );
}

function ViewMode({
  viewerName,
  onMakeOwn,
}: {
  viewerName: string;
  onMakeOwn: () => void;
}) {
  return (
    <div className="min-h-screen">
      <BuilderHeader readOnly viewerName={viewerName} />

      <div id="bracket-export" className="bg-background pb-32">
        <Section
          step="01"
          title="Group stage"
          subtitle="predicted group order"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupLetters.map((g) => (
              <GroupCard key={g} group={g} readOnly />
            ))}
          </div>
        </Section>

        <Section step="02" title="Best thirds" subtitle="advancing thirds">
          <ThirdPlacePicker readOnly />
        </Section>

        <Section step="03" title="Knockouts" subtitle="predicted bracket">
          <KnockoutTree readOnly />
        </Section>

        <Section step="04" title="Awards" subtitle="predicted winners">
          <AwardsSectionReadOnly />
        </Section>
      </div>

      <StickyShareView onMakeOwn={onMakeOwn} />
    </div>
  );
}

function AwardsSectionReadOnly() {
  return <AwardsSection readOnly />;
}

function BuilderHeader({
  readOnly,
  viewerName,
}: {
  readOnly?: boolean;
  viewerName?: string;
}) {
  const reset = useBracket((s) => s.reset);
  return (
    <header className="border-b border-border bg-paper">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 md:px-12">
        <div className="flex items-center gap-4">
          <Wordmark size="sm" />
          <BrandLine className="hidden md:flex" />
        </div>
        <div className="flex items-center gap-3">
          {readOnly && viewerName && (
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {viewerName}'s prediction
            </span>
          )}
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("Clear the entire bracket?")) reset();
              }}
              className="gap-1.5 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function Section({
  step,
  title,
  subtitle,
  children,
}: {
  step: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
      <header className="mb-8 flex flex-col gap-2 border-b border-border pb-6 md:flex-row md:items-baseline md:gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {step}
          </p>
          <h2 className="display mt-2 text-4xl font-light tracking-tighter md:text-5xl">
            {title}
          </h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">{subtitle}</p>
      </header>
      {children}
    </section>
  );
}

function StickyShare() {
  const champion = useBracket((s) => s.bracket.champion);
  const championTeam = champion ? teamById[champion] : null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-3 md:px-12">
        <div className="min-w-0 flex items-center gap-3">
          {championTeam ? (
            <>
              <Flag team={championTeam} size="md" />
              <div className="min-w-0">
                <p className="truncate text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Your pick to win it all
                </p>
                <p className="truncate display text-base font-medium">
                  {championTeam.name}
                </p>
              </div>
            </>
          ) : (
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Champion
              </p>
              <p className="text-sm text-muted-foreground">Yet to be picked</p>
            </div>
          )}
        </div>
        <ShareBar exportTargetId="bracket-export" />
      </div>
    </div>
  );
}

function StickyShareView({ onMakeOwn }: { onMakeOwn: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-3 md:px-12">
        <p className="text-sm text-muted-foreground">
          Like what you see? Build your own bracket.
        </p>
        <Button
          size="lg"
          className="gap-2 rounded-full px-6"
          onClick={onMakeOwn}
        >
          Make your own
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

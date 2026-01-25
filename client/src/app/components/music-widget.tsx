import { useEffect, useRef, useState } from "react";
import { Music2, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Slider } from "@/app/components/ui/slider";

type Track = {
  src: string; // e.g. "/fts.mp3"
  title: string;
  artist: string;
  coverSrc?: string; // e.g. "/fts.jpeg"
};

type MusicWidgetProps = {
  tracks?: Track[];
  defaultOpen?: boolean;
  defaultTrackIndex?: number;
};

export function MusicWidget({
  tracks = [
    { src: "/fts.mp3", title: "From The Start", artist: "Laufey", coverSrc: "/fts.jpeg" },
    { src: "/hs.mp3", title: "From the Dining Table", artist: "Harry Styles", coverSrc: "/hs.jpg" },
  ],
  defaultOpen = true,
  defaultTrackIndex = 0,
}: MusicWidgetProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [open, setOpen] = useState(defaultOpen);
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [status, setStatus] = useState<"idle" | "playing" | "paused" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [trackIndex, setTrackIndex] = useState(() => {
    const idx = Number.isFinite(defaultTrackIndex) ? defaultTrackIndex : 0;
    return Math.min(Math.max(idx, 0), Math.max(tracks.length - 1, 0));
  });

  const track = tracks[trackIndex] ?? tracks[0];
  const src = track?.src ?? "/fts.mp3";
  const title = track?.title ?? "unknown";
  const artist = track?.artist ?? "unknown";
  const coverSrc = track?.coverSrc;

  // keep audio element synced with UI
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
    a.muted = muted;
  }, [volume, muted]);

  // when src changes, reload; if already playing, keep playing
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    setErrorMsg(null);
    setStatus(enabled ? "playing" : "idle");

    a.pause();
    a.currentTime = 0;
    a.load();

    if (enabled) {
      a.play().catch((e: any) => {
        setStatus("error");
        setEnabled(false);
        const msg =
          e?.name === "NotAllowedError"
            ? "Playback blocked. Click play again, and make sure the tab isn’t muted."
            : e?.name === "NotSupportedError"
              ? "Audio format not supported by this browser."
              : e?.message || "Audio playback failed.";

        setErrorMsg(
          `${msg} (Also check that ${src} loads in the browser — open it directly to confirm it’s not 404.)`
        );
        setOpen(true);
      });
    }
  }, [src, enabled]);

  const handlePlayPause = async () => {
    const a = audioRef.current;
    if (!a) return;

    // Pause
    if (enabled) {
      a.pause();
      setEnabled(false);
      setStatus("paused");
      return;
    }

    // Play (must be triggered by user click)
    try {
      setErrorMsg(null);

      // Ensure element is configured before play
      a.volume = volume;
      a.muted = muted;

      // Some browsers need this to re-evaluate the resource after hot reload
      if (a.readyState === 0) a.load();

      await a.play();
      setEnabled(true);
      setStatus("playing");
    } catch (e: any) {
      setEnabled(false);
      setStatus("error");

      const msg =
        e?.name === "NotAllowedError"
          ? "Playback blocked. Click play again, and make sure the tab isn’t muted."
          : e?.name === "NotSupportedError"
            ? "Audio format not supported by this browser."
            : e?.message || "Audio playback failed.";

      setErrorMsg(
        `${msg} (Also check that ${src} loads in the browser — open it directly to confirm it’s not 404.)`
      );
      setOpen(true);
    }
  };

  const handleToggleMute = () => {
    setMuted((m) => {
      const next = !m;
      const a = audioRef.current;
      if (a) a.muted = next;
      return next;
    });
  };

  const nextTrack = () => {
    if (tracks.length <= 1) return;
    setTrackIndex((i) => (i + 1) % tracks.length);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onEnded={nextTrack}
        onPlay={() => setStatus("playing")}
        onPause={() => setStatus("paused")}
        onError={() => {
          setStatus("error");
          setEnabled(false);
          setErrorMsg(
            `Could not load audio. Make sure the file exists at ${src} — it should be in client/public so ${src} returns 200.`
          );
        }}
      />

      <div className="fixed bottom-4 right-4 z-50">
        {open ? (
          <Card className="w-[320px] p-4 shadow-lg overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {coverSrc ? (
                  <img
                    src={coverSrc}
                    alt={`${title} cover`}
                    className="h-10 w-10 rounded-md object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border border-border shrink-0">
                    <Music2 className="w-4 h-4" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="text-sm lowercase font-medium truncate">{title}</div>
                  <div className="text-xs lowercase text-muted-foreground truncate">{artist}</div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="opacity-70 hover:opacity-100 transition-opacity"
                aria-label="close"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 text-xs text-muted-foreground lowercase">
              {status === "playing"
                ? "playing on loop"
                : status === "paused"
                  ? "paused"
                  : "tap play to start (browser requires click)"}
            </div>

            {errorMsg && (
              <div className="mt-2 text-xs lowercase text-destructive break-words">{errorMsg}</div>
            )}

            <div className="mt-3 flex items-center gap-2 flex-nowrap">
              <Button onClick={handlePlayPause} className="lowercase flex-1 min-w-0" type="button">
                {enabled ? "pause" : "play"}
              </Button>

              <Button
                variant="outline"
                onClick={nextTrack}
                className="px-3 shrink-0"
                type="button"
                disabled={tracks.length <= 1}
                aria-label="next track"
              >
                next
              </Button>

              <Button
                variant="outline"
                onClick={handleToggleMute}
                className="w-10 px-0 shrink-0"
                aria-label="mute"
                type="button"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>

            <div className="mt-3">
              <div className="text-xs lowercase text-muted-foreground mb-2">volume</div>
              <Slider
                value={[volume]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(v) => setVolume(v[0] ?? 0.6)}
              />
            </div>
          </Card>
        ) : (
          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            className="lowercase shadow-md"
            type="button"
          >
            <Music2 className="w-4 h-4 mr-2" />
            music
          </Button>
        )}
      </div>
    </>
  );
}
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  X,
  Lock,
  StopCircle,
  Send,
  Play,
  Pause,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceRecorderProps {
  onSend: (duration: number, waveform: number[]) => void;
  onCancel: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function generateWaveform(length: number): number[] {
  return Array.from({ length }, () => Math.random() * 0.8 + 0.2);
}

type RecordingState = 'idle' | 'recording' | 'locked-recording' | 'preview';

export default function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const [state, setState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waveformRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start recording
  const startRecording = useCallback(() => {
    setState('recording');
    setDuration(0);
    setWaveform([]);
    setIsPlaying(false);
    setPlayProgress(0);

    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);

    waveformRef.current = setInterval(() => {
      setWaveform((prev) => {
        const newBar = Math.random() * 0.8 + 0.2;
        if (prev.length >= 50) return [...prev.slice(1), newBar];
        return [...prev, newBar];
      });
    }, 100);
  }, []);

  // Lock recording
  const lockRecording = useCallback(() => {
    setState('locked-recording');
  }, []);

  // Stop recording (transition to preview)
  const stopRecording = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (waveformRef.current) { clearInterval(waveformRef.current); waveformRef.current = null; }
    setState('preview');
  }, []);

  // Cancel recording
  const cancelRecording = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (waveformRef.current) { clearInterval(waveformRef.current); waveformRef.current = null; }
    if (playRef.current) { clearInterval(playRef.current); playRef.current = null; }
    setState('idle');
    setDuration(0);
    setWaveform([]);
    setIsPlaying(false);
    setPlayProgress(0);
    onCancel();
  }, [onCancel]);

  // Delete recording and go back to idle
  const deleteRecording = useCallback(() => {
    if (playRef.current) { clearInterval(playRef.current); playRef.current = null; }
    setState('idle');
    setDuration(0);
    setWaveform([]);
    setIsPlaying(false);
    setPlayProgress(0);
  }, []);

  // Toggle play/pause preview
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      if (playRef.current) { clearInterval(playRef.current); playRef.current = null; }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setPlayProgress(0);
      const totalSteps = duration * 10;
      let step = 0;
      playRef.current = setInterval(() => {
        step++;
        setPlayProgress((step / totalSteps) * 100);
        if (step >= totalSteps) {
          if (playRef.current) { clearInterval(playRef.current); playRef.current = null; }
          setIsPlaying(false);
          setPlayProgress(0);
        }
      }, 100);
    }
  }, [isPlaying, duration]);

  // Send recording
  const handleSend = useCallback(() => {
    if (playRef.current) { clearInterval(playRef.current); playRef.current = null; }
    const finalWaveform = waveform.length > 0 ? waveform : generateWaveform(30);
    onSend(duration, finalWaveform);
  }, [duration, waveform, onSend]);

  // Auto-start recording on mount
  useEffect(() => {
    startRecording();
  }, [startRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (waveformRef.current) clearInterval(waveformRef.current);
      if (playRef.current) clearInterval(playRef.current);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {/* Recording State (not locked) */}
      {state === 'recording' && (
        <motion.div
          key="recording"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex items-center gap-3 px-4 py-3 bg-background border-t"
        >
          {/* Cancel */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-destructive"
            onClick={cancelRecording}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Timer & Waveform */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-sm font-mono text-destructive tabular-nums shrink-0">
              {formatTime(duration)}
            </span>
            <div className="flex-1 flex items-center gap-[2px] h-8 overflow-hidden">
              {waveform.map((bar, i) => (
                <motion.div
                  key={`${i}-${bar.toFixed(2)}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className="w-[3px] bg-primary rounded-full origin-bottom"
                  style={{ height: `${bar * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Lock */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={lockRecording}
          >
            <Lock className="h-4 w-4" />
          </Button>

          {/* Pulsing Mic */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="shrink-0"
          >
            <div className="h-10 w-10 rounded-full bg-destructive flex items-center justify-center">
              <Mic className="h-5 w-5 text-white" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Locked Recording State (still recording, but locked) */}
      {state === 'locked-recording' && (
        <motion.div
          key="locked-recording"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex items-center gap-3 px-4 py-3 bg-background border-t"
        >
          {/* Play preview */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {/* Timer & Waveform */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-sm font-mono text-destructive tabular-nums shrink-0">
              {formatTime(duration)}
            </span>
            <div className="flex-1 flex items-center gap-[2px] h-8 overflow-hidden">
              {waveform.map((bar, i) => (
                <motion.div
                  key={`${i}-${bar.toFixed(2)}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className="w-[3px] bg-primary rounded-full origin-bottom"
                  style={{ height: `${bar * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-destructive"
            onClick={cancelRecording}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Stop */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={stopRecording}
          >
            <StopCircle className="h-6 w-6 text-destructive" />
          </Button>

          {/* Send */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-primary"
            onClick={handleSend}
          >
            <Send className="h-5 w-5" />
          </Button>
        </motion.div>
      )}

      {/* Preview State (recording stopped, reviewing before send) */}
      {state === 'preview' && (
        <motion.div
          key="preview"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex items-center gap-3 px-4 py-3 bg-background border-t"
        >
          {/* Play / Pause */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {/* Timer & Waveform */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground tabular-nums shrink-0">
              {formatTime(duration)}
            </span>
            <div className="flex-1 relative">
              {isPlaying && (
                <div
                  className="absolute top-0 bottom-0 left-0 bg-primary/10 rounded-sm pointer-events-none transition-all duration-100"
                  style={{ width: `${playProgress}%` }}
                />
              )}
              <div className="flex items-center gap-[2px] h-8 overflow-hidden relative">
                {waveform.map((bar, i) => {
                  const totalBars = waveform.length;
                  const progressIndex = (playProgress / 100) * totalBars;
                  return (
                    <div
                      key={i}
                      className={`w-[3px] rounded-full origin-bottom ${
                        isPlaying && i < progressIndex
                          ? 'bg-primary'
                          : 'bg-muted-foreground/40'
                      }`}
                      style={{ height: `${bar * 100}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Duration label */}
          <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
            {formatTime(duration)}
          </span>

          {/* Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-destructive"
            onClick={deleteRecording}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Send */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-primary"
            onClick={handleSend}
          >
            <Send className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

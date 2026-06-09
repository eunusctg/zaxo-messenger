'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const MAX_OPTIONS = 12;

interface PollCreateProps {
  onCreatePoll?: (poll: {
    question: string;
    options: string[];
    allowMultiple: boolean;
    showResults: boolean;
  }) => void;
  onClose: () => void;
}

export default function PollCreate({ onCreatePoll, onClose }: PollCreateProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [showResultsAfterVoting, setShowResultsAfterVoting] = useState(false);

  const addOption = useCallback(() => {
    if (options.length < MAX_OPTIONS) {
      setOptions((prev) => [...prev, '']);
    }
  }, [options.length]);

  const removeOption = useCallback(
    (index: number) => {
      if (options.length > 2) {
        setOptions((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [options.length]
  );

  const updateOption = useCallback((index: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }, []);

  const canCreate =
    question.trim().length > 0 && options.filter((o) => o.trim().length > 0).length >= 2;

  const handleCreate = () => {
    if (!canCreate) return;
    onCreatePoll?.({
      question: question.trim(),
      options: options.filter((o) => o.trim()),
      allowMultiple,
      showResults: showResultsAfterVoting,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-background border-t border-border rounded-t-2xl shadow-2xl"
      style={{ maxHeight: '85vh' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm">Create Poll</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-y-auto max-h-[60vh] p-4 space-y-5">
        {/* Question Input */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Question</Label>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="h-11 rounded-xl bg-muted/30"
            maxLength={200}
          />
          <p className="text-[10px] text-muted-foreground mt-1 text-right">
            {question.length}/200
          </p>
        </div>

        {/* Options */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Options</Label>
            <span className="text-[10px] text-muted-foreground">
              {options.length}/{MAX_OPTIONS}
            </span>
          </div>

          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-5 w-5 rounded-full border-2 border-primary/30 shrink-0 flex items-center justify-center">
                    {option.trim() && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-2.5 w-2.5 rounded-full bg-primary"
                      />
                    )}
                  </div>
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="h-10 rounded-lg bg-muted/30 flex-1"
                    maxLength={100}
                  />
                  {options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {options.length < MAX_OPTIONS && (
            <Button
              variant="ghost"
              className="w-full mt-2 rounded-xl text-primary hover:bg-primary/5 gap-1.5 h-10"
              onClick={addOption}
            >
              <Plus className="h-4 w-4" />
              Add Option
            </Button>
          )}
        </div>

        <Separator />

        {/* Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Allow multiple answers</p>
              <p className="text-xs text-muted-foreground">
                Voters can select more than one option
              </p>
            </div>
            <Switch checked={allowMultiple} onCheckedChange={setAllowMultiple} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Show results after voting</p>
              <p className="text-xs text-muted-foreground">
                Results are hidden until someone votes
              </p>
            </div>
            <Switch checked={showResultsAfterVoting} onCheckedChange={setShowResultsAfterVoting} />
          </div>
        </div>
      </div>

      {/* Create Button */}
      <div className="border-t px-4 py-3">
        <Button
          className="w-full h-11 rounded-xl gap-1.5"
          disabled={!canCreate}
          onClick={handleCreate}
        >
          <Check className="h-4 w-4" />
          Create Poll
        </Button>
      </div>
    </motion.div>
  );
}

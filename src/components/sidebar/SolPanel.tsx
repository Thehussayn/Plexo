import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const SolPanel: React.FC = () => {
  const { selectedNode } = useEditor();
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const suggestedPrompts = [
    'Refine typography hierarchy for mobile',
    'Generate high-converting hero copy',
    'Improve spacing and padding harmony',
    'Make layout stack on smaller screens',
  ];

  const handleApply = (instruction: string) => {
    setIsProcessing(true);
    setLastAction(`SOL applied: "${instruction}"`);
    setTimeout(() => {
      setIsProcessing(false);
      setPrompt('');
    }, 900);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none font-sans text-xs text-[#EDEDED]">
      {/* Context Target Banner */}
      <div className="px-3 py-2 bg-[#141414] border-b border-[#242424] flex items-center justify-between text-[11px] text-[#9CA3AF]">
        <span>Context:</span>
        <span className="font-medium text-purple-300 truncate max-w-[140px]">
          {selectedNode ? selectedNode.name : 'Entire Page'}
        </span>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Prompt Input Box */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-semibold text-[#6B7280]">
            AI Prompt & Layout Guidance
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                selectedNode
                  ? `Instruct SOL on "${selectedNode.name}" (e.g. adjust tone, font scale, or padding)...`
                  : 'Ask SOL to optimize the page layout, audit accessibility, or rewrite sections...'
              }
              rows={4}
              className="w-full bg-[#1F1F1F] border border-[#2C2C2C] rounded-xl p-2.5 text-xs text-[#EDEDED] placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] resize-none leading-relaxed transition-colors"
            />
            <button
              onClick={() => handleApply(prompt || 'Optimized layout hierarchy')}
              disabled={isProcessing}
              className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-medium text-[11px] flex items-center gap-1 shadow-sm transition-all"
            >
              {isProcessing ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
              <span>Run</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {lastAction && (
          <div className="p-2.5 bg-purple-950/30 border border-purple-500/30 rounded-xl text-[11px] text-purple-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{lastAction}</span>
          </div>
        )}

        {/* Quick Suggested Prompts */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] uppercase font-semibold text-[#6B7280]">
            Suggested Actions
          </span>
          <div className="space-y-1.5">
            {suggestedPrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleApply(s)}
                className="w-full text-left p-2.5 bg-[#1C1C1C] hover:bg-[#252525] rounded-xl border border-[#282828] hover:border-purple-500/40 text-[11px] text-[#EDEDED] flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2">
                  <Wand2 className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="leading-snug">{s}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-[#6B7280] group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

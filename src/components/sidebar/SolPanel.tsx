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
              className="w-full bg-[#1F1F1F] border border-[#2C2C2C] rounded-xl p-2.5 text-xs text-[#EDEDED] placeholder-[#6B7280] focus:outline-none focus:border-[#96F02E] resize-none leading-relaxed transition-colors"
            />
            <button
              onClick={() => handleApply(prompt || 'Optimized layout hierarchy')}
              disabled={isProcessing}
              className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-lg bg-[#96F02E] hover:bg-[#85DC20] disabled:opacity-50 text-black font-semibold text-[11px] flex items-center gap-1 shadow-none transition-all cursor-pointer"
            >
              {isProcessing ? (
                <RefreshCw className="w-3 h-3 animate-spin stroke-[2.5]" />
              ) : (
                <Send className="w-3 h-3 stroke-[2.5]" />
              )}
              <span>Run</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {lastAction && (
          <div className="p-2.5 bg-[#96F02E]/10 border border-[#96F02E]/30 rounded-xl text-[11px] text-[#96F02E] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#96F02E] shrink-0" />
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
                className="w-full text-left p-2.5 bg-[#1C1C1C] hover:bg-[#252525] rounded-xl border border-[#282828] hover:border-[#96F02E]/40 text-[11px] text-[#EDEDED] flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Wand2 className="w-3 h-3 text-[#96F02E] shrink-0" />
                  <span className="leading-snug">{s}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-[#6B7280] group-hover:text-[#96F02E] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

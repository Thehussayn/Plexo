import { createContext, useContext } from 'react';
import { ViewportMode } from '../types/editor';

export const FrameBreakpointContext = createContext<ViewportMode | null>(null);

export const useFrameBreakpoint = () => useContext(FrameBreakpointContext);

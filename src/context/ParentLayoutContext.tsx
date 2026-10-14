import { createContext, useContext } from 'react';
import { LayoutMode } from '../types/editor';

interface ParentLayoutContextValue {
  layoutMode: LayoutMode;
  parentId: string;
  parentWidth?: number;
  parentHeight?: number;
}

export const ParentLayoutContext = createContext<ParentLayoutContextValue>({
  layoutMode: 'free',
  parentId: '',
});

export const useParentLayout = () => useContext(ParentLayoutContext);

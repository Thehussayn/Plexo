import React from 'react';
import { EditorProvider } from './context/EditorContext';
import { EditorShell } from './components/layout/EditorShell';

export const App: React.FC = () => {
  return (
    <EditorProvider>
      <EditorShell />
    </EditorProvider>
  );
};

export default App;

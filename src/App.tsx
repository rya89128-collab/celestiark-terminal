import { useEffect } from 'react';
import { MnemosyneTerminal } from './lore/MnemosyneTerminal';
import { initializeAnalytics } from './utils/analytics';

export default function App() {
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return <MnemosyneTerminal />;
}

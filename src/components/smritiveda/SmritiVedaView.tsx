import React, { useState } from 'react';
import { 
  BookOpen, 
  Flame, 
  Sparkles,
  Award
} from 'lucide-react';
import { CulturalLibraryView } from './CulturalLibraryView';
import { ChantingStudioView } from './ChantingStudioView';
import type { CulturalItem } from '../../types';

export const SmritiVedaView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'library' | 'chanting'>('library');
  const [selectedChantItem, setSelectedChantItem] = useState<CulturalItem | undefined>(undefined);

  const handleSelectForChanting = (item: CulturalItem) => {
    setSelectedChantItem(item);
    setActiveSubTab('chanting');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sub-tab navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => setActiveSubTab('library')}
          className={`btn btn-sm ${activeSubTab === 'library' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
        >
          <BookOpen size={15} />
          <span>Cultural & Philosophical Library</span>
        </button>

        <button
          onClick={() => setActiveSubTab('chanting')}
          className={`btn btn-sm ${activeSubTab === 'chanting' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
        >
          <Flame size={15} />
          <span>Interactive Chanting Studio</span>
        </button>
      </div>

      {/* Views */}
      {activeSubTab === 'library' && (
        <CulturalLibraryView onSelectForChanting={handleSelectForChanting} />
      )}

      {activeSubTab === 'chanting' && (
        <ChantingStudioView initialItem={selectedChantItem} />
      )}
    </div>
  );
};

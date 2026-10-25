import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  Volume2, 
  VolumeX,
  BookOpen, 
  Sparkles, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Info, 
  Check, 
  Languages 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CULTURAL_LIBRARY } from '../../data/culturalContent';
import type { CulturalItem } from '../../types';
import { useAudioService } from '../../hooks/useAudioService';

interface CulturalLibraryViewProps {
  onSelectForChanting?: (item: CulturalItem) => void;
  onSelectForGame?: (item: CulturalItem) => void;
}

export const CulturalLibraryView: React.FC<CulturalLibraryViewProps> = ({
  onSelectForChanting,
  onSelectForGame
}) => {
  const { favourites, toggleFavourite, speechRate: userSpeechRate } = useApp();
  const { 
    playbackState, 
    activeId, 
    currentLineIndex, 
    totalLines, 
    speak, 
    pause, 
    resume, 
    stop, 
    setRate 
  } = useAudioService();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [showFavouritesOnly, setShowFavouritesOnly] = useState<boolean>(false);
  const [localRate, setLocalRate] = useState<number>(userSpeechRate || 1.0);

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  const filteredItems = CULTURAL_LIBRARY.filter(item => {
    if (showFavouritesOnly && !favourites.includes(item.id)) return false;
    if (selectedLang !== 'all' && item.language !== selectedLang) return false;
    if (selectedCat !== 'all' && item.category !== selectedCat) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = item.title.toLowerCase().includes(q);
      const inText = item.originalText.toLowerCase().includes(q);
      const inMeaning = item.meaning.toLowerCase().includes(q);
      const inTranslit = item.transliteration?.toLowerCase().includes(q);
      const inTags = item.tags.some(t => t.toLowerCase().includes(q));
      if (!inTitle && !inText && !inMeaning && !inTranslit && !inTags) return false;
    }

    return true;
  });

  const handlePlayRecitation = (item: CulturalItem) => {
    if (activeId === item.id) {
      if (playbackState === 'playing') {
        pause();
      } else if (playbackState === 'paused') {
        resume();
      } else {
        speak(item.originalText, { id: item.id, language: item.language, rate: localRate });
      }
    } else {
      speak(item.originalText, { id: item.id, language: item.language, rate: localRate });
    }
  };

  const handleStop = () => {
    stop();
  };

  const handleReplay = (item: CulturalItem) => {
    speak(item.originalText, { id: item.id, language: item.language, rate: localRate });
  };

  const handleRateChange = (newRate: number) => {
    setLocalRate(newRate);
    setRate(newRate);
    if (activeId && playbackState === 'playing') {
      const currentItem = CULTURAL_LIBRARY.find(c => c.id === activeId);
      if (currentItem) {
        speak(currentItem.originalText, { id: currentItem.id, language: currentItem.language, rate: newRate });
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header Overview */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-sage">Smriti Veda</span>
          <span className="badge badge-teal">Cultural Literature & Recitation</span>
        </div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Classical Passages, Shlokas & Philosophy
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '680px', marginTop: '4px' }}>
          Listen to clear audible recitations, master verse pacing, and practice active recall. Default selections feature universal English philosophy alongside foundational Sanskrit shlokas.
        </p>
      </div>

      {/* 2. Search & Filter Toolbar */}
      <div className="clean-card" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by title, original verse, meaning, or concept..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ width: '100%', paddingLeft: '36px', fontSize: '0.9rem' }}
            />
          </div>

          {/* Speed Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '2px' }}>Pace:</span>
            {[
              { r: 0.85, l: '0.85×' },
              { r: 1.0, l: '1.0×' },
              { r: 1.2, l: '1.2×' },
            ].map(s => (
              <button
                key={s.r}
                type="button"
                onClick={() => handleRateChange(s.r)}
                style={{
                  background: localRate === s.r ? 'var(--primary)' : 'transparent',
                  color: localRate === s.r ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {s.l}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFavouritesOnly(p => !p)}
            className={`btn ${showFavouritesOnly ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <Heart size={14} fill={showFavouritesOnly ? 'currentColor' : 'none'} />
            <span>Saved ({favourites.length})</span>
          </button>
        </div>

        {/* Language Pill Filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '8px' }}>
          {[
            { id: 'all', label: `All Collections (${CULTURAL_LIBRARY.length})` },
            { id: 'english', label: `English & Universal (${CULTURAL_LIBRARY.filter(i => i.language === 'english').length})` },
            { id: 'sanskrit', label: `संस्कृतम् (${CULTURAL_LIBRARY.filter(i => i.language === 'sanskrit').length})` },
            { id: 'hindi', label: `हिन्दी (${CULTURAL_LIBRARY.filter(i => i.language === 'hindi').length})` },
            { id: 'telugu', label: `తెలుగు (${CULTURAL_LIBRARY.filter(i => i.language === 'telugu').length})` }
          ].map(lang => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${selectedLang === lang.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                background: selectedLang === lang.id ? 'var(--primary-subtle)' : '#FFFFFF',
                color: selectedLang === lang.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Category Pill Filters */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'shloka', label: 'Shlokas & Verses' },
            { id: 'mantra', label: 'Mantras' },
            { id: 'poem', label: 'Poems & Literature' },
            { id: 'proverb', label: 'Proverbs & Wisdom' },
            { id: 'story', label: 'Stories & Readings' },
            { id: 'song', label: 'Chants & Songs' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${selectedCat === cat.id ? 'var(--accent-teal)' : 'var(--border-subtle)'}`,
                background: selectedCat === cat.id ? 'var(--accent-teal-subtle)' : 'transparent',
                color: selectedCat === cat.id ? 'var(--accent-teal)' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Results Counter & Active Playback Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredItems.length}</strong> classical passages
        </div>

        {activeId && playbackState !== 'idle' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--accent-teal-subtle)',
            border: '1px solid rgba(30, 112, 101, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 12px',
            fontSize: '0.8rem',
            color: 'var(--accent-teal)',
            fontWeight: 600
          }}>
            <Volume2 size={14} />
            <span>
              {playbackState === 'playing' ? 'Reciting' : 'Paused'}: {CULTURAL_LIBRARY.find(c => c.id === activeId)?.title}
              {totalLines > 0 && ` (Line ${currentLineIndex + 1}/${totalLines})`}
            </span>
            <button
              onClick={handleStop}
              style={{ background: 'none', border: 'none', color: 'var(--accent-terracotta)', cursor: 'pointer', marginLeft: '6px', padding: 0 }}
              title="Stop audio"
            >
              <Square size={12} fill="currentColor" />
            </button>
          </div>
        )}
      </div>

      {/* 4. Passages Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '20px'
      }}>
        {filteredItems.map(item => {
          const isFav = favourites.includes(item.id);
          const isThisActive = activeId === item.id;
          const isThisPlaying = isThisActive && playbackState === 'playing';
          const isThisPaused = isThisActive && playbackState === 'paused';
          const lines = item.originalText.split('\n').filter(Boolean);

          return (
            <div
              key={item.id}
              className="clean-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                border: isThisActive ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                boxShadow: isThisActive ? 'var(--shadow-lg)' : 'var(--shadow-md)',
                background: '#FFFFFF'
              }}
            >
              <div>
                {/* Header badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="badge badge-sage" style={{ textTransform: 'capitalize' }}>
                      {item.language}
                    </span>
                    <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                      {item.category}
                    </span>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      ⏱️ {item.estimatedMinutes || 2}m
                    </span>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>
                      {item.difficulty}
                    </span>
                    {/* Honest audio classification badge */}
                    <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                      {item.audioSourceType === 'recording' ? 'Original Recording' : 'Speech Recitation'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFavourite(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: isFav ? 'var(--accent-terracotta)' : 'var(--text-muted)'
                    }}
                    title={isFav ? 'Remove from saved' : 'Save passage'}
                  >
                    <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Title */}
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-main)' }}>
                  {item.title}
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Source: {item.source}
                </div>

                {/* Song Recitation Honest Notice */}
                {item.category === 'song' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.76rem',
                    color: 'var(--accent-teal)',
                    background: 'var(--accent-teal-subtle)',
                    border: '1px solid rgba(30, 112, 101, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 10px',
                    marginBottom: '12px'
                  }}>
                    <Info size={13} />
                    <span>Recited in rhythmic meter via speech synthesis (no external mock music player).</span>
                  </div>
                )}

                {/* Original Script with line-by-line highlight during playback */}
                <div style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card-inner)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '1.08rem',
                  lineHeight: 1.8,
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  fontFamily: 'serif',
                  marginBottom: '12px'
                }}>
                  {lines.map((line, idx) => {
                    const isLineActive = isThisPlaying && idx === currentLineIndex;
                    return (
                      <div
                        key={idx}
                        style={{
                          background: isLineActive ? 'var(--primary-subtle)' : 'transparent',
                          color: isLineActive ? 'var(--primary)' : 'var(--text-main)',
                          borderRadius: '4px',
                          padding: '1px 6px',
                          transition: 'background 0.2s, color 0.2s'
                        }}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>

                {/* Transliteration */}
                {item.transliteration && (
                  <div style={{
                    fontSize: '0.84rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                    marginBottom: '10px',
                    lineHeight: 1.5
                  }}>
                    {item.transliteration}
                  </div>
                )}

                {/* Meaning */}
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: '16px'
                }}>
                  {item.meaning}
                </div>
              </div>

              {/* Action Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => handlePlayRecitation(item)}
                    className={`btn ${isThisPlaying ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {isThisPlaying ? (
                      <>
                        <Pause size={14} />
                        <span>Pause</span>
                      </>
                    ) : isThisPaused ? (
                      <>
                        <Play size={14} fill="currentColor" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} fill="currentColor" />
                        <span>Recite</span>
                      </>
                    )}
                  </button>

                  {isThisActive && (
                    <>
                      <button
                        onClick={handleStop}
                        className="btn btn-secondary btn-sm"
                        title="Stop recitation"
                      >
                        <Square size={13} />
                        <span>Stop</span>
                      </button>
                      <button
                        onClick={() => handleReplay(item)}
                        className="btn btn-secondary btn-sm"
                        title="Replay from start"
                      >
                        <RotateCcw size={13} />
                      </button>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {onSelectForChanting && (
                    <button
                      onClick={() => onSelectForChanting(item)}
                      className="btn btn-secondary btn-sm"
                    >
                      <span>Chant</span>
                    </button>
                  )}
                  {onSelectForGame && (
                    <button
                      onClick={() => onSelectForGame(item)}
                      className="btn btn-secondary btn-sm"
                    >
                      <span>Drill</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

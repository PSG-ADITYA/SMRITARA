import React from 'react';
import { 
  Info, 
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PersonalPatternsView: React.FC = () => {
  const { patternInsights, dailyLogs, memorySessions, mindfulnessSessions } = useApp();

  return (
    <div>
      {/* Pattern Engine Intro Card */}
      <div className="glass-card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-purple">The Core Differentiator</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Personal Growth Feedback Loop
              </span>
            </div>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 900 }}>
              Personal Pattern Engine
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '720px', marginTop: '6px' }}>
              Unlike generic fitness trackers that silo your metrics, SMRITARA continuously analyzes the statistical relationships between your sleep, habits, cognitive exercises, and subjective energy.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card-inner)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Data Points
            </div>
            <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-light)' }}>
              {dailyLogs.length} Days • {memorySessions.length} Tests • {mindfulnessSessions.length} Breaths
            </div>
          </div>
        </div>
      </div>

      {/* Methodology & Ethics Note */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(20, 184, 166, 0.08)',
        border: '1px solid rgba(20, 184, 166, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
        marginBottom: '28px'
      }}>
        <Info size={18} color="#2dd4bf" />
        <span style={{ fontSize: '0.85rem', color: '#ccfbf1' }}>
          <strong>Scientific Humility Principle:</strong> Correlation is not causation. SMRITARA strictly distinguishes observed statistical associations from biological hypotheses and actionable recommendations. No medical inferences are drawn.
        </span>
      </div>

      {/* Insights Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {patternInsights.map(insight => (
          <div key={insight.id} className="glass-card" style={{ padding: '28px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Activity size={18} color="var(--primary-light)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{insight.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Metric Pair: <strong style={{ color: 'var(--text-secondary)' }}>{insight.metricPair}</strong> • Sample Size: {insight.sampleCount} entries
                  </div>
                </div>
              </div>

              <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                {insight.confidence}
              </span>
            </div>

            {/* Triad Breakdown: Observation -> Hypothesis -> Recommendation */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {/* 1. Observation */}
              <div className="glass-card-inner">
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  1. Grounded Observation
                </div>
                <p style={{ fontSize: '0.88rem', color: '#f1f5f9', lineHeight: 1.5 }}>
                  {insight.observation}
                </p>
              </div>

              {/* 2. Hypothesis */}
              <div className="glass-card-inner">
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', marginBottom: '6px' }}>
                  2. Working Hypothesis
                </div>
                <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  {insight.hypothesis}
                </p>
              </div>

              {/* 3. Actionable Recommendation */}
              <div className="glass-card-inner" style={{ borderLeft: '3px solid #10b981' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '6px' }}>
                  3. Actionable Recommendation
                </div>
                <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  {insight.recommendation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

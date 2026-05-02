import React from 'react';
import './VoteCard.css';

function VoteCard({
  name,
  displayName,
  emoji,
  value,
  total,
  color,
  gradient,
  isVoting,
  isLeader,
  justVoted,
  onVote,
  disabled,
}) {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

  return (
    <button
      className={`vote-card ${isVoting ? 'voting' : ''} ${isLeader ? 'leader' : ''} ${justVoted ? 'just-voted' : ''}`}
      onClick={onVote}
      disabled={disabled}
      data-testid={`vote-card-${name}`}
      aria-label={`Vote for ${displayName}. Current votes: ${value}`}
    >
      {isLeader && (
        <div className="leader-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>Leading</span>
        </div>
      )}

      <div className="card-emoji">{emoji}</div>
      <h3 className="card-name">{displayName}</h3>

      <div className="card-votes">
        <span className="card-count" style={{ color }}>{value}</span>
        <span className="card-label">votes</span>
      </div>

      <div className="card-bar-track">
        <div
          className="card-bar-fill"
          style={{
            width: `${percentage}%`,
            background: gradient,
          }}
        />
      </div>
      <span className="card-percentage">{percentage}%</span>

      <div className="card-vote-cta" style={{ background: gradient }}>
        {isVoting ? (
          <span className="cta-loading">
            <span className="cta-spinner" />
          </span>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Vote</span>
          </>
        )}
      </div>
    </button>
  );
}

export default VoteCard;

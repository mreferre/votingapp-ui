import React from 'react';
import './VoteChart.css';

function VoteChart({ votes, meta, total }) {
  const maxValue = votes.length > 0 ? Math.max(...votes.map((v) => v.value), 1) : 1;

  return (
    <div className="chart-container" data-testid="vote-chart">
      <div className="chart-table">
        <div className="chart-header-row">
          <div className="chart-cell chart-header">Restaurant</div>
          <div className="chart-cell chart-header chart-header-right">Votes</div>
          <div className="chart-cell chart-header chart-header-bar">Distribution</div>
          <div className="chart-cell chart-header chart-header-right">Share</div>
        </div>
        {votes.map((vote) => {
          const m = meta[vote.name] || {
            displayName: vote.name,
            emoji: '\uD83C\uDF7D\uFE0F',
            gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          };
          const pct = total > 0 ? ((vote.value / total) * 100).toFixed(1) : '0.0';
          const barWidth = maxValue > 0 ? (vote.value / maxValue) * 100 : 0;

          return (
            <div className="chart-row" key={vote.name} data-testid={`chart-row-${vote.name}`}>
              <div className="chart-cell chart-restaurant">
                <span className="chart-emoji">{m.emoji}</span>
                <span className="chart-name">{m.displayName}</span>
              </div>
              <div className="chart-cell chart-value">{vote.value}</div>
              <div className="chart-cell chart-bar-cell">
                <div className="chart-bar-bg">
                  <div
                    className="chart-bar"
                    style={{
                      width: `${barWidth}%`,
                      background: m.gradient,
                    }}
                  />
                </div>
              </div>
              <div className="chart-cell chart-pct">{pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VoteChart;

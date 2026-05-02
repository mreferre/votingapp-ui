import React, { useState, useEffect, useCallback, useRef } from 'react';
import VoteCard from './VoteCard';
import VoteChart from './VoteChart';
import './Dashboard.css';

const RESTAURANT_META = {
  outback: {
    displayName: 'Outback Steakhouse',
    emoji: '\uD83E\uDD69',
    color: 'var(--color-outback)',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
  bucadibeppo: {
    displayName: 'Buca di Beppo',
    emoji: '\uD83C\uDF5D',
    color: 'var(--color-bucadibeppo)',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  ihop: {
    displayName: 'IHOP',
    emoji: '\uD83E\uDD5E',
    color: 'var(--color-ihop)',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  chipotle: {
    displayName: 'Chipotle',
    emoji: '\uD83C\uDF2F',
    color: 'var(--color-chipotle)',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
  },
};

function Dashboard({ apiEndpoint, user, onLogout }) {
  const [votes, setVotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingFor, setVotingFor] = useState(null);
  const [lastVoted, setLastVoted] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const pollRef = useRef(null);

  const fetchVotes = useCallback(async () => {
    try {
      const res = await fetch(`${apiEndpoint}/api/getvotes`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setVotes(data);
      setTotalVotes(data.reduce((sum, v) => sum + v.value, 0));
      setError(null);
    } catch (err) {
      setError('Failed to fetch votes. Check your connection.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint]);

  useEffect(() => {
    fetchVotes();
    pollRef.current = setInterval(fetchVotes, 10000);
    return () => clearInterval(pollRef.current);
  }, [fetchVotes]);

  const handleVote = useCallback(
    async (restaurant) => {
      if (votingFor) return;
      setVotingFor(restaurant);
      try {
        const res = await fetch(`${apiEndpoint}/api/${restaurant}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setLastVoted(restaurant);
        // Brief delay so user sees the animation, then refresh
        setTimeout(async () => {
          await fetchVotes();
          setVotingFor(null);
        }, 400);
      } catch (err) {
        setError('Failed to submit vote. Please try again.');
        setVotingFor(null);
        console.error('Vote error:', err);
      }
    },
    [apiEndpoint, fetchVotes, votingFor]
  );

  const leader =
    votes.length > 0
      ? votes.reduce((a, b) => (a.value > b.value ? a : b))
      : null;

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="header-title">Restaurant Voting</h1>
              <p className="header-tagline">Pick your favorite, see who wins</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-badge">
              <div className="user-avatar">
                {user.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user}</span>
            </div>
            <button className="logout-button" onClick={onLogout} title="Sign out">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Error Toast */}
        {error && (
          <div className="error-toast" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
            <button className="toast-dismiss" onClick={() => setError(null)}>&times;</button>
          </div>
        )}

        {/* Stats Row */}
        <section className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Votes</span>
            <span className="stat-value">{totalVotes}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Restaurants</span>
            <span className="stat-value">{votes.length}</span>
          </div>
          <div className="stat-card highlight">
            <span className="stat-label">Current Leader</span>
            <span className="stat-value">
              {leader
                ? `${RESTAURANT_META[leader.name]?.emoji || ''} ${RESTAURANT_META[leader.name]?.displayName || leader.name}`
                : '--'}
            </span>
          </div>
        </section>

        {/* Loading State */}
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading votes...</p>
          </div>
        ) : (
          <>
            {/* Voting Grid */}
            <section className="vote-section">
              <div className="section-header">
                <h2 className="section-title">Cast Your Vote</h2>
                <p className="section-desc">Click on a restaurant to vote</p>
              </div>
              <div className="vote-grid" data-testid="vote-grid">
                {votes.map((vote) => {
                  const meta = RESTAURANT_META[vote.name] || {
                    displayName: vote.name,
                    emoji: '\uD83C\uDF7D\uFE0F',
                    color: 'var(--color-primary)',
                    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  };
                  return (
                    <VoteCard
                      key={vote.name}
                      name={vote.name}
                      displayName={meta.displayName}
                      emoji={meta.emoji}
                      value={vote.value}
                      total={totalVotes}
                      color={meta.color}
                      gradient={meta.gradient}
                      isVoting={votingFor === vote.name}
                      isLeader={leader && leader.name === vote.name && totalVotes > 0}
                      justVoted={lastVoted === vote.name}
                      onVote={() => handleVote(vote.name)}
                      disabled={!!votingFor}
                    />
                  );
                })}
              </div>
            </section>

            {/* Chart Section */}
            <section className="chart-section">
              <div className="section-header">
                <h2 className="section-title">Results Overview</h2>
                <p className="section-desc">Live vote distribution</p>
              </div>
              <VoteChart votes={votes} meta={RESTAURANT_META} total={totalVotes} />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Restaurant Voting App &middot; Powered by AWS App Runner &amp; DynamoDB</p>
      </footer>
    </div>
  );
}

export default Dashboard;

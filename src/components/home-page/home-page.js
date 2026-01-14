import { useState, useEffect, useCallback } from 'react';
import { compressPuzzleDigits } from '../../lib/string-utils';
import { modelHelpers } from '../../lib/sudoku-model';
import SudokuMiniGrid from '../sudoku-grid/sudoku-mini-grid';
import './home-page.css';

function stopPropagation(e) {
    e.stopPropagation();
}

function NYTPuzzleItem({ puzzle, showRatings, shortenLinks }) {
    const puzzleString = shortenLinks
        ? compressPuzzleDigits(puzzle.digits)
        : puzzle.digits;

    // Map difficulty to level number for URL compatibility
    const difficultyLevelMap = {
        'easy': '1',
        'medium': '2',
        'hard': '3',
        'expert': '4',
    };
    const level = difficultyLevelMap[puzzle.difficulty] || '3';

    // Format date as "May 13, 2023"
    const dateStr = puzzle.date
        ? puzzle.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : '';

    const difficultyBadge = puzzle.difficulty
        ? <span className={`difficulty-badge ${puzzle.difficulty}`}>{puzzle.difficulty}</span>
        : null;

    return (
        <li>
            <a href={`./?s=${puzzleString}&d=${level}`} onClick={stopPropagation}>
                <div className="nyt-puzzle-item">
                    <SudokuMiniGrid puzzle={puzzle} showRatings={showRatings} />
                    <div className="nyt-puzzle-info">
                        <div className="nyt-puzzle-date">{dateStr}</div>
                        {difficultyBadge}
                    </div>
                </div>
            </a>
        </li>
    );
}

function groupPuzzlesByMonth(puzzles) {
    const groups = {};
    puzzles.forEach(puzzle => {
        if (!puzzle.date) return;

        const monthYear = puzzle.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        if (!groups[monthYear]) {
            groups[monthYear] = [];
        }
        groups[monthYear].push(puzzle);
    });
    return groups;
}

function NYTPuzzleList({ nytPuzzles, showRatings, shortenLinks }) {
    const [collapsed, setCollapsed] = useState({});

    if (!nytPuzzles || nytPuzzles.length === 0) {
        return (
            <div className="nyt-puzzles-empty">
                No NYT puzzles found. Please check the nyt-scraper/sudoku directory.
            </div>
        );
    }

    const puzzlesByMonth = groupPuzzlesByMonth(nytPuzzles);
    const monthNames = Object.keys(puzzlesByMonth);

    const sections = monthNames.map((monthName, idx) => {
        const isCollapsed = collapsed[monthName] !== undefined ? collapsed[monthName] : (idx > 0);
        const puzzles = puzzlesByMonth[monthName];

        const puzzleItems = puzzles.map((puzzle, i) => (
            <NYTPuzzleItem
                key={puzzle.id || i}
                puzzle={puzzle}
                showRatings={showRatings}
                shortenLinks={shortenLinks}
            />
        ));

        const toggleCollapsed = () => {
            setCollapsed(prev => ({ ...prev, [monthName]: !isCollapsed }));
        };

        const classes = `section nyt-month-section ${isCollapsed ? 'collapsed' : ''}`;

        return (
            <div key={monthName} className={classes} onClick={toggleCollapsed}>
                <h2>{monthName} <span className="puzzle-count">({puzzles.length})</span></h2>
                <ul>{puzzleItems}</ul>
            </div>
        );
    });

    return (
        <div className="nyt-puzzles">
            {sections}
        </div>
    );
}

function HomePage({ nytPuzzles, showRatings, shortenLinks, onNewPuzzle, onImportPuzzle, onSettings, onAbout }) {
    const [activeTab, setActiveTab] = useState('nyt'); // 'nyt', 'in-progress', 'history'
    const [inProgressPuzzles, setInProgressPuzzles] = useState([]);
    const [historyPuzzles, setHistoryPuzzles] = useState([]);

    const loadPuzzles = useCallback(() => {
        // Load in-progress puzzles - need to create a proper grid with settings
        const settings = modelHelpers.loadSettings();
        const tempGrid = { 
            get: (key) => {
                if (key === 'settings') return settings;
                return undefined;
            }
        };
        const savedPuzzles = modelHelpers.getSavedPuzzles(tempGrid) || [];
        setInProgressPuzzles(savedPuzzles);
        
        // Load history
        const history = modelHelpers.getAllPuzzleHistory();
        setHistoryPuzzles(history);
        
        console.log('Loaded:', savedPuzzles.length, 'in progress,', history.length, 'history items');
    }, []);

    // Load puzzles and check for auto-abandon on mount
    useEffect(() => {
        // Check for puzzles to auto-abandon
        modelHelpers.checkAutoAbandon();
        loadPuzzles();
    }, [loadPuzzles]);

    // Reload when tab becomes active
    useEffect(() => {
        const handleFocus = () => {
            console.log('Window focused, reloading puzzles');
            loadPuzzles();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [loadPuzzles]);

    const formatElapsedTime = (elapsedTime) => {
        const seconds = Math.floor(elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    };

    const renderInProgressPuzzles = () => {
        if (inProgressPuzzles.length === 0) {
            return (
                <div className="puzzles-empty">
                    No puzzles in progress. Start a new puzzle to begin!
                </div>
            );
        }

        return (
            <div className="saved-puzzles-list">
                {inProgressPuzzles.map((puzzle, idx) => {
                    const puzzleString = shortenLinks
                        ? compressPuzzleDigits(puzzle.initialDigits)
                        : puzzle.initialDigits;
                    
                    const dateStr = new Date(puzzle.lastUpdatedTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return (
                        <div key={idx} className="saved-puzzle-item">
                            <a href={`./?s=${puzzleString}&d=${puzzle.difficultyLevel || ''}&r=1`}>
                                <SudokuMiniGrid 
                                    puzzle={{ 
                                        digits: puzzle.completedDigits || puzzle.initialDigits,
                                        difficulty: puzzle.difficultyRating
                                    }} 
                                    showRatings={showRatings} 
                                />
                                <div className="saved-puzzle-info">
                                    <div className="saved-puzzle-time">
                                        <strong>Time:</strong> {formatElapsedTime(puzzle.elapsedTime)}
                                    </div>
                                    <div className="saved-puzzle-date">
                                        Last played: {dateStr}
                                    </div>
                                </div>
                            </a>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderHistoryPuzzles = () => {
        if (historyPuzzles.length === 0) {
            return (
                <div className="puzzles-empty">
                    No puzzle history yet. Complete or abandon puzzles to see them here!
                </div>
            );
        }

        return (
            <div className="history-puzzles-list">
                {historyPuzzles.map((entry, idx) => {
                    const puzzleString = shortenLinks
                        ? compressPuzzleDigits(entry.initialDigits)
                        : entry.initialDigits;
                    
                    const dateStr = new Date(entry.archivedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    const statusBadge = entry.status === 'solved' 
                        ? <span className="status-badge solved">✓ Solved</span>
                        : <span className="status-badge abandoned">Abandoned</span>;

                    // Create URLs for replay and solve again
                    const replayUrl = `./?s=${puzzleString}&d=${entry.difficultyLevel || ''}&replay=1&attempt=${entry.attemptIndex}`;
                    const solveAgainUrl = `./?s=${puzzleString}&d=${entry.difficultyLevel || ''}`;

                    return (
                        <div key={idx} className="history-puzzle-item">
                            <SudokuMiniGrid 
                                puzzle={{ 
                                    digits: entry.initialDigits,
                                    difficulty: entry.difficultyRating
                                }} 
                                showRatings={showRatings} 
                            />
                            <div className="history-puzzle-info">
                                {statusBadge}
                                <div className="history-puzzle-time">
                                    <strong>Time:</strong> {formatElapsedTime(entry.elapsedTime)}
                                </div>
                                <div className="history-puzzle-date">
                                    {dateStr}
                                </div>
                                <div className="history-puzzle-actions">
                                    <a href={replayUrl} className="btn-small btn-secondary">
                                        ▶ Replay
                                    </a>
                                    <a href={solveAgainUrl} className="btn-small btn-primary">
                                        ↻ Solve Again
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="home-page">
            <div className="home-page-content">
                <section className="action-section">
                    <h2>Get Started</h2>
                    <div className="action-cards">
                        <div className="action-card" onClick={onNewPuzzle}>
                            <div className="action-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <line x1="9" y1="3" x2="9" y2="21" />
                                    <line x1="15" y1="3" x2="15" y2="21" />
                                    <line x1="3" y1="9" x2="21" y2="9" />
                                    <line x1="3" y1="15" x2="21" y2="15" />
                                </svg>
                            </div>
                            <h3>New Puzzle</h3>
                            <p>Create a new puzzle from scratch</p>
                        </div>

                        <div className="action-card" onClick={onImportPuzzle}>
                            <div className="action-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </div>
                            <h3>Import Puzzle</h3>
                            <p>Paste or import a puzzle</p>
                        </div>

                        <div className="action-card" onClick={onSettings}>
                            <div className="action-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M12 1v6m0 6v6m4.22-13.22l-4.24 4.24m-4.24 4.24L3.5 18.5m17-2.72l-4.24-4.24m-4.24-4.24L7.78 3.06" />
                                </svg>
                            </div>
                            <h3>Settings</h3>
                            <p>Configure app preferences</p>
                        </div>
                    </div>
                </section>

                <section className="puzzles-section">
                    <div className="tabs-container">
                        <button 
                            className={`tab ${activeTab === 'nyt' ? 'active' : ''}`}
                            onClick={() => setActiveTab('nyt')}
                        >
                            NYT Puzzles
                        </button>
                        <button 
                            className={`tab ${activeTab === 'in-progress' ? 'active' : ''}`}
                            onClick={() => setActiveTab('in-progress')}
                        >
                            In Progress {inProgressPuzzles.length > 0 && <span className="badge">{inProgressPuzzles.length}</span>}
                        </button>
                        <button 
                            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            History {historyPuzzles.length > 0 && <span className="badge">{historyPuzzles.length}</span>}
                        </button>
                    </div>

                    {activeTab === 'nyt' && (
                        <div className="tab-content">
                            <p className="section-description">Select from a collection of New York Times Sudoku puzzles</p>
                            <NYTPuzzleList 
                                nytPuzzles={nytPuzzles}
                                showRatings={showRatings}
                                shortenLinks={shortenLinks}
                            />
                        </div>
                    )}

                    {activeTab === 'in-progress' && (
                        <div className="tab-content">
                            <p className="section-description">Continue solving your active puzzles</p>
                            {renderInProgressPuzzles()}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="tab-content">
                            <p className="section-description">Review your completed and abandoned puzzles</p>
                            {renderHistoryPuzzles()}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default HomePage;

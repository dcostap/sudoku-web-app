import { useState, useEffect, useCallback, useMemo } from 'react';
import { compressPuzzleDigits } from '../../lib/string-utils';
import { modelHelpers } from '../../lib/sudoku-model';
import SudokuMiniGrid from '../sudoku-grid/sudoku-mini-grid';
import PuzzleItem from '../puzzle-item/puzzle-item';
import './home-page.css';
import '../new-styles.css';

function stopPropagation(e) {
    e.stopPropagation();
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
    const [expandedMonth, setExpandedMonth] = useState(null);

    const puzzlesByMonth = useMemo(() => groupPuzzlesByMonth(nytPuzzles), [nytPuzzles]);
    const monthNames = useMemo(() => Object.keys(puzzlesByMonth), [puzzlesByMonth]);

    if (!nytPuzzles || nytPuzzles.length === 0) {
        return (
            <div className="nyt-puzzles-empty">
                No NYT puzzles found. Please run the scraper script.
            </div>
        );
    }

    const sections = monthNames.map((monthName) => {
        const isExpanded = expandedMonth === monthName;
        const puzzles = puzzlesByMonth[monthName];

        const toggleExpanded = (e) => {
            e.stopPropagation();
            setExpandedMonth(isExpanded ? null : monthName);
        };

        return (
            <div key={monthName} className={`nyt-month-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
                <h2 onClick={toggleExpanded}>
                    <span className="month-name">{monthName}</span>
                    <span className="puzzle-count">{puzzles.length} puzzles</span>
                    <span className="chevron">{isExpanded ? '−' : '+'}</span>
                </h2>
                {isExpanded && (
                    <ul>
                        {puzzles.map((puzzle, i) => (
                            <li key={puzzle.id || i}>
                                <PuzzleItem
                                    puzzle={puzzle}
                                    showRatings={showRatings}
                                    shortenLinks={shortenLinks}
                                    type="nyt"
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    });

    return (
        <div className="nyt-puzzles-list">
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

    const handleDiscard = (puzzleId) => {
        if (window.confirm('Are you sure you want to discard this puzzle progress?')) {
            modelHelpers.deleteSavedPuzzle(puzzleId);
            loadPuzzles();
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
                {inProgressPuzzles.map((puzzle, idx) => (
                    <PuzzleItem 
                        key={idx}
                        puzzle={puzzle}
                        showRatings={showRatings}
                        shortenLinks={shortenLinks}
                        type="saved"
                        actions={
                            <>
                                <a 
                                    href={modelHelpers.getPuzzleUrl(puzzle, shortenLinks)}
                                    className="btn-small btn-primary"
                                >
                                    Resume
                                </a>
                                <button 
                                    className="btn-small btn-secondary"
                                    onClick={() => handleDiscard(puzzle.id)}
                                >
                                    Discard
                                </button>
                            </>
                        }
                    />
                ))}
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
                {historyPuzzles.map((entry, idx) => (
                    <PuzzleItem 
                        key={idx}
                        puzzle={entry}
                        showRatings={showRatings}
                        shortenLinks={shortenLinks}
                        type="history"
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="home-page">
            <main className="home-page-content">
                <header className="home-hero">
                    <h1>Sudoku</h1>
                </header>
                <section className="action-section">
                    <div className="action-grid">
                        <button className="action-btn primary" onClick={onNewPuzzle}>
                            <div className="icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </div>
                            <div className="text">
                                <h3>New Puzzle</h3>
                                <p>Start fresh</p>
                            </div>
                        </button>

                        <button className="action-btn secondary" onClick={onImportPuzzle}>
                            <div className="icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            </div>
                            <div className="text">
                                <h3>Import</h3>
                                <p>Paste puzzle</p>
                            </div>
                        </button>

                        <button className="action-btn secondary" onClick={onSettings}>
                            <div className="icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                            </div>
                            <div className="text">
                                <h3>Settings</h3>
                                <p>Preferences</p>
                            </div>
                        </button>
                    </div>
                </section>

                <section className="puzzles-explorer">
                    <nav className="tabs">
                        <button 
                            className={`tab-item ${activeTab === 'nyt' ? 'active' : ''}`}
                            onClick={() => setActiveTab('nyt')}
                        >
                            New York Times Archive
                        </button>
                        <button 
                            className={`tab-item ${activeTab === 'in-progress' ? 'active' : ''}`}
                            onClick={() => setActiveTab('in-progress')}
                        >
                            In Progress {inProgressPuzzles.length > 0 && <span className="count">{inProgressPuzzles.length}</span>}
                        </button>
                        <button 
                            className={`tab-item ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            History {historyPuzzles.length > 0 && <span className="count">{historyPuzzles.length}</span>}
                        </button>
                    </nav>

                    <div className="tab-panels">
                        {activeTab === 'nyt' && (
                            <div className="panel">
                                <NYTPuzzleList 
                                    nytPuzzles={nytPuzzles}
                                    showRatings={showRatings}
                                    shortenLinks={shortenLinks}
                                />
                            </div>
                        )}

                        {activeTab === 'in-progress' && (
                            <div className="panel">
                                {renderInProgressPuzzles()}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="panel">
                                {renderHistoryPuzzles()}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default HomePage;

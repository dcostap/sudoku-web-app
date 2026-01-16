import { modelHelpers } from '../../lib/sudoku-model';
import { secondsAsHMS } from '../../lib/string-utils';
import SudokuMiniGrid from '../sudoku-grid/sudoku-mini-grid';
import './puzzle-item.css';

const stopPropagation = (e) => {
    if (e) e.stopPropagation();
};

function PuzzleItem({ puzzle, type = 'nyt', showRatings, shortenLinks, onClick, actions }) {
    const puzzleUrl = modelHelpers.getPuzzleUrl(puzzle, shortenLinks);
    
    // Normalize difficulty mapping
    const difficultyMap = {
        '1': 'easy',
        '2': 'medium',
        '3': 'hard',
        'easy': 'easy',
        'medium': 'medium',
        'hard': 'hard',
        'expert': 'expert'
    };
    
    const difficultyKey = puzzle.difficultyLevel || puzzle.difficulty;
    const difficultyLevel = difficultyMap[String(difficultyKey).toLowerCase()] || 'easy';

    const renderNYTTag = () => (
        <div className="nyt-tag" title="New York Times Sudoku">
            <span className="nyt-icon">T</span> NYT Crossword
        </div>
    );

    const renderStatusBadge = () => {
        if (type === 'nyt') return null;
        const status = (puzzle.status || (puzzle.isSolved ? 'solved' : 'draft')).toLowerCase();
        let label = status;
        if (status === 'solved') label = '✓ Solved';
        if (status === 'draft' || status === 'enter') label = '✎ Draft';
        if (status === 'abandoned') label = 'Abandoned';
        
        const className = (status === 'enter' ? 'draft' : status);
        return <span className={`status-badge ${className}`}>{label}</span>;
    };

    const timeString = puzzle.elapsedTime ? secondsAsHMS(Math.floor(puzzle.elapsedTime / 1000)) : null;

    // Date formatting
    let dateStr = 'Unknown Date';
    if (puzzle.date) {
        const d = puzzle.date instanceof Date ? puzzle.date : new Date(puzzle.date);
        dateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } else if (puzzle.lastPlayed) {
        const d = new Date(puzzle.lastPlayed);
        dateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    const defaultActions = type === 'history' ? (
        <>
            <a 
                href={`${puzzleUrl}&replay=1`} 
                className="btn-small btn-secondary text-primary-600 border-primary-100 hover:bg-primary-50"
            >
                ▶ Replay
            </a>
            <a 
                href={puzzleUrl} 
                className="btn-small btn-primary"
            >
                {puzzle.status === 'draft' || puzzle.mode === 'enter' ? '✎ Resume' : '↻ Again'}
            </a>
        </>
    ) : null;

    const itemActions = actions || defaultActions;

    return (
        <div className={`puzzle-item ${type}`}>
            <a href={onClick ? '#' : puzzleUrl} onClick={onClick || undefined}>
                <SudokuMiniGrid puzzle={puzzle} size={84} />
                <div className="puzzle-info">
                    {renderStatusBadge()}
                    <span className={`difficulty-badge ${difficultyLevel}`}>
                        {difficultyLevel}
                    </span>
                    <span className="puzzle-date">{dateStr}</span>
                    {timeString && <span className="puzzle-time">{timeString}</span>}
                    {puzzle.isNYT && renderNYTTag()}
                </div>
            </a>
            {itemActions && (
                <div className="puzzle-actions" onClick={stopPropagation}>
                    {itemActions}
                </div>
            )}
        </div>
    );
}

export default PuzzleItem;

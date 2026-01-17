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

    const nytInfo = modelHelpers.getNYTInfo(puzzle.initialDigits || puzzle.digits || puzzle.id || '');

    const renderNYTTag = () => {
        if (!nytInfo) return null;
        
        const mainDateString = new Date(puzzle.date || puzzle.lastPlayed).toDateString();
        const nytDateString = nytInfo.date.toDateString();
        const showNytDate = mainDateString !== nytDateString;

        return (
            <div className="nyt-tag" title="New York Times Sudoku">
                <span className="text-theme-accent font-bold">NYT</span>
                {showNytDate && (
                    <span className="opacity-70 ml-1.5 text-xs text-nowrap">
                        {nytInfo.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                )}
            </div>
        );
    };

    const renderStatusBadge = () => {
        if (type === 'nyt' || (nytInfo && type !== 'history')) return null;
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
        const formattedDate = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        
        if (type === 'history' || puzzle.status === 'solved') {
            dateStr = `Solved ${formattedDate}`;
        } else if (type === 'in-progress' || type === 'saved' || puzzle.status === 'draft') {
            dateStr = `Saved ${formattedDate}`;
        } else {
            dateStr = formattedDate;
        }
    } else if (puzzle.lastPlayed) {
        const d = new Date(puzzle.lastPlayed);
        dateStr = `Last played ${d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`;
    }

    const defaultActions = type === 'history' ? (
        <>
            <a 
                href={`${puzzleUrl}&replay=1`} 
                className="btn-small btn-secondary whitespace-nowrap"
            >
                ▶ Replay
            </a>
            <a 
                href={type === 'history' ? `${puzzleUrl}&restart=1` : puzzleUrl} 
                className="btn-small btn-primary whitespace-nowrap"
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
                    <div className="puzzle-tags">
                        <span className={`difficulty-badge ${difficultyLevel}`}>
                            {difficultyLevel}
                        </span>
                        {renderNYTTag()}
                    </div>
                    <span className="puzzle-date">{dateStr}</span>
                    {timeString && <span className="puzzle-time">{timeString}</span>}
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

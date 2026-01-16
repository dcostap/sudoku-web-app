import './sudoku-grid.css';

import GridLines from './grid-lines.js';


function SudokuMiniGrid({puzzle, size='120px'}) {
    const cellSize = 100;
    
    let digits = '';
    let completedDigits = '';

    if (typeof puzzle === 'string') {
        digits = puzzle;
        completedDigits = puzzle;
    } else {
        digits = puzzle.initialDigits || puzzle.digits || '';
        completedDigits = puzzle.completedDigits || digits;
    }

    const puzzleDigits = completedDigits.split('').map((digit, i) => {
        if (digit === '0' || digit === '.') {
            return null;
        }
        const className = digits[i] === '0' || digits[i] === '.' ? 'user-digit' : 'digit';
        const row = Math.floor(i / 9);
        const col = i % 9;
        return (
            <text
                key={i}
                className={className}
                x={col * cellSize + 50}
                y={row * cellSize + 80}
                fontSize={84}
                textAnchor="middle"
            >
                {digit}
            </text>
        )
    });

    return (
        <div className="sudoku-grid mini" style={{width: size, aspectRatio: '1/1'}}>
            <svg version="1.1" viewBox="0 0 900 900">
                <rect className="grid-bg" width="100%" height="100%" />
                {puzzleDigits}
                <GridLines cellSize={cellSize} marginSize={0} />
            </svg>
        </div>
    );
}

export default SudokuMiniGrid;

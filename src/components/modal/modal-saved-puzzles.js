import { modelHelpers } from '../../lib/sudoku-model';
import PuzzleItem from "../puzzle-item/puzzle-item";

function SavedPuzzleList({savedPuzzles=[], showRatings, shortenLinks, discardHandler, cancelHandler}) {
    const puzzles = savedPuzzles.map((puzzle) => {
        const actions = (
            <>
                <a 
                    href={modelHelpers.getPuzzleUrl(puzzle, shortenLinks)}
                    className="btn-small btn-primary"
                >
                    Resume
                </a>
                <button
                    className="btn-small btn-secondary text-rose-600 border-rose-100 hover:bg-rose-50"
                    onClick={discardHandler}
                    data-puzzle-state-key={puzzle.puzzleStateKey}
                >
                    Discard
                </button>
            </>
        );

        return <PuzzleItem
            key={puzzle.puzzleStateKey}
            puzzle={puzzle}
            showRatings={showRatings}
            shortenLinks={shortenLinks}
            type="saved"
            actions={actions}
        />
    });
    return <>
        <h1>{savedPuzzles.length === 1 ? 'Resume or Discard?' : 'In-progress Puzzles'}</h1>
        <p>
            {savedPuzzles.length === 1 
                ? 'You have a saved game for this puzzle. Pick up where you left off or discard it.'
                : 'Select a puzzle to resume or discard it to clear space.'}
        </p>
        <div className="space-y-4">
            {puzzles}
        </div>
        <div className="buttons">
            <button className="secondary" onClick={cancelHandler}>Back</button>
        </div>
    </>;
}


function ModalSavedPuzzles({modalState, modalHandler}) {
    const {savedPuzzles, showRatings, shortenLinks} = modalState;
    const cancelHandler = () => modalHandler('show-welcome-modal');
    const discardHandler = (e) => {
        const puzzleStateKey = e.currentTarget.dataset.puzzleStateKey;
        modalHandler({
            action: 'discard-saved-puzzle',
            puzzleStateKey,
        });
    };

    return (
        <div className="modal saved-puzzles">
             <SavedPuzzleList
                 savedPuzzles={savedPuzzles}
                 showRatings={showRatings}
                 shortenLinks={shortenLinks}
                 discardHandler={discardHandler}
                 cancelHandler={cancelHandler}
             />
        </div>
    );
}

export default ModalSavedPuzzles;

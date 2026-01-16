import PuzzleItem from "../puzzle-item/puzzle-item";

function ModalResumeRestart({modalState, modalHandler}) {
    const {puzzleState, showRatings} = modalState;
    const {puzzleStateKey} = puzzleState;
    const resumeHandler = () => modalHandler({
        action: 'resume-saved-puzzle',
        puzzleStateKey
    });
    const restartHandler = () => modalHandler({
        action: 'restart-over-saved-puzzle',
        puzzleStateKey
    });
    return (
        <div className="modal resume-restart">
            <h1>Continue or start over?</h1>
            <p>You've made a start on this puzzle already. You can either pick up
            where you left off, or start again from the beginning.</p>
            <div className="mb-8">
                <PuzzleItem
                    puzzle={puzzleState}
                    showRatings={showRatings}
                    type="saved"
                    onClick={resumeHandler}
                />
            </div>
            <div className="buttons">
                <button className="secondary" onClick={restartHandler}>Restart</button>
                <button className="primary" onClick={resumeHandler} autoFocus={true}>Continue</button>
            </div>
        </div>
    );
}


export default ModalResumeRestart;

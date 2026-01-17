import ModalIcon from './modal-icon';

export default function ModalConfirmDesignStart({modalState, modalHandler}) {
    const errorMessage = modalState.errorMessage;
    const cancelHandler = () => modalHandler('cancel');
    const confirmHandler = () => modalHandler('start-puzzle-anyway');
    const icon = <span className="icon check-result-warning"><ModalIcon icon="warning" /></span>;
    
    return (
        <div className="modal check-result">
            <h1>Invalid Puzzle</h1>
            <div className="icon-message">
                {icon}
                <p>{errorMessage}</p>
            </div>
            <p className="mt-4 text-sm opacity-80">Do you want to continue anyway?</p>
            <div className="buttons">
                <button className="secondary" onClick={cancelHandler}>Back</button>
                <button className="primary" onClick={confirmHandler} autoFocus>Continue Anyway</button>
            </div>
        </div>
    )
}

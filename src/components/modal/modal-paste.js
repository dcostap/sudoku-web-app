import { useState } from 'react';

import { expandPuzzleDigits } from '../../lib/string-utils';
import { modelHelpers } from '../../lib/sudoku-model';


export default function ModalPaste({modalHandler}) {
    const [newDigits, setNewDigits] = useState('');
    const [historyData, setHistoryData] = useState(null);

    const inputHandler = (e) => {
        let text = e.target.value;
        
        // Check if it's a history dump first
        const history = modelHelpers.deserializeHistoryEntry(text.trim());
        if (history) {
            setHistoryData(history);
            setNewDigits(text);
            return;
        }

        setHistoryData(null);
        const match = text.replace(/\s+/gs, '').replace(/[_.-]/g, '0').match(/^(\d{81}|[0-9a-zA-Z]{13,81})$/);
        text = match ? match[1] : text;
        if(text.match(/^[0-9a-zA-Z]+$/)) {
            text = expandPuzzleDigits(text);
        }
        setNewDigits(text);
    };
    const haveValidDigits = !historyData && newDigits.match(/^\d{81}$/);
    const haveHistory = !!historyData;
    const submitClass = (haveValidDigits || haveHistory) ? 'primary' : null;
    const cancelHandler = () => modalHandler('cancel-paste');
    const pasteHandler = () => {
        if (haveHistory) {
            modalHandler({
                action: 'import-history',
                historyData: historyData,
            });
        } else if (haveValidDigits) {
            modalHandler({
                action: 'paste-initial-digits',
                digits: newDigits,
            });
        }
    }
    const buttonText = haveHistory ? 'Import History' : 'Start Solving';

    return (
        <div className="modal paste">
            <h1>Import Puzzle</h1>
            <p>Paste a string of 81 digits, a shortened puzzle link, or a history dump.</p>
            <textarea 
                value={newDigits} 
                onChange={inputHandler} 
                placeholder="00000000000..."
                autoFocus 
            />
            {haveHistory && <div className="text-xs text-theme-success mt-2">✓ History dump detected</div>}
            <div className="buttons">
                <button className="secondary" onClick={cancelHandler}>Cancel</button>
                <button className={submitClass} onClick={pasteHandler} disabled={!haveValidDigits && !haveHistory}>{buttonText}</button>
            </div>
        </div>
    );
}

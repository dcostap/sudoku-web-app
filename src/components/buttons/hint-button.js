import { useCallback } from 'react';

import ButtonIcon from '../svg-sprites/button-icon';

export default function HintButton ({menuHandler}) {
    const clickHandler = useCallback(
        e => {
            e.preventDefault();
            const menuAction = 'show-hint-modal';
            menuHandler(menuAction);
        },
        [menuHandler]
    );

    return (
        <button 
            id="hint-button" 
            type="button" 
            title="Hint" 
            onClick={clickHandler}
            className="icon-button active:scale-95"
        >
            <ButtonIcon name="hint" />
        </button>
    )
}

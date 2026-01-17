import { useState, useCallback } from 'react';

import ButtonIcon from '../svg-sprites/button-icon';

import './menu-button.css';


function MenuButton ({initialDigits, showPencilmarks, menuHandler}) {
    const [hidden, setHidden] = useState(true);

    const toggleHandler = useCallback(
        () => setHidden(h => !h),
        []
    );

    const clickHandler = useCallback(
        e => {
            const parent = e.target.parentElement;
            if (parent.classList && parent.classList.contains('disabled')) {
                e.preventDefault();
                return;
            }
            const menuAction = e.target.dataset.menuAction;
            if (menuAction) {
                e.preventDefault();
                menuHandler(menuAction);
            }
            setHidden(true);
        },
        [menuHandler]
    );

    const showHidePencilmarks = showPencilmarks ? 'Hide' : 'Show';

    const overlay = hidden
        ? null
        : <div className="fixed inset-0 z-40" onClick={() => setHidden(true)} />

    const shareLinkClass = initialDigits ? '' : 'disabled';

    return (
        <div className="relative">
            { overlay }
            <button 
                type="button" 
                title="Menu" 
                onClick={toggleHandler}
                className="icon-button active:scale-95"
            >
                <ButtonIcon name="menu" />
            </button>
            {!hidden && (
                <ul 
                    onClick={clickHandler}
                    className="menu-panel rounded-xl animate-slide-down"
                >
                    <li className={shareLinkClass}>
                        <a 
                            href="./" 
                            data-menu-action="show-share-modal"
                            className="menu-item"
                        >Share this puzzle</a>
                    </li>
                    <li>
                        <a 
                            href="./" 
                            data-menu-action="toggle-show-pencilmarks"
                            className="menu-item"
                        >{showHidePencilmarks} pencil marks</a>
                    </li>
                    <li>
                        <a 
                            href="./" 
                            data-menu-action="clear-pencilmarks"
                            className="menu-item"
                        >Clear all pencil marks</a>
                    </li>
                    <li className={shareLinkClass}>
                        <a 
                            href="./" 
                            data-menu-action="calculate-candidates"
                            className="menu-item"
                        >Auto calculate candidates</a>
                    </li>
                    <div className="menu-divider" />
                    <li>
                        <a 
                            href="./" 
                            data-menu-action="save-screenshot"
                            className="menu-item"
                        >Save a screenshot</a>
                    </li>
                    <li className={shareLinkClass}>
                        <a 
                            href="./" 
                            data-menu-action="show-solver-modal"
                            className="menu-item"
                        >Open in SudokuWiki.org solver</a>
                    </li>
                    <div className="menu-divider" />
                    <li className={shareLinkClass}>
                        <a 
                            href="./" 
                            data-menu-action="restart-puzzle"
                            className="menu-item"
                        >Restart puzzle</a>
                    </li>
                    <li className={shareLinkClass}>
                        <a 
                            href="./" 
                            data-menu-action="abandon-puzzle"
                            className="menu-item text-theme-error"
                        >Abandon puzzle</a>
                    </li>
                    <div className="menu-divider" />
                    <li>
                        <a 
                            href="./"
                            className="menu-item"
                        >New puzzle</a>
                    </li>
                    <li>
                        <a 
                            href="./" 
                            data-menu-action="show-settings-modal"
                            className="menu-item"
                        >Settings</a>
                    </li>
                    <li>
                        <a 
                            href="./" 
                            data-menu-action="show-help-page"
                            className="menu-item"
                        >Help</a>
                    </li>
                    <li>
                        <a 
                            href="./" 
                            data-menu-action="show-about-modal"
                            className="menu-item"
                        >About this app</a>
                    </li>
                </ul>
            )}
        </div>
    )
}

export default MenuButton;

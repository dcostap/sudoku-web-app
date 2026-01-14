import React from 'react';
import "../new-styles.css";

export default function VirtualKeyboard({ inputMode, completedDigits, inputHandler, simplePencilMarking }) {
    
    const stopPropagation = (e) => e.stopPropagation();

    const handleAction = (keyValue, wantDoubleClick = false) => {
        inputHandler({
            type: 'vkbdKeyPress',
            wantDoubleClick: wantDoubleClick ? 'true' : null,
            keyValue,
            value: keyValue,
            source: 'click'
        });
    };

    const modeBtn = (label, mode, internalMode) => {
        const isActive = inputMode === internalMode;
        return (
            <button 
                className={`vk-btn vk-btn-label ${isActive ? 'vk-btn-active' : ''}`}
                onClick={() => handleAction(`input-mode-${internalMode}`, internalMode === 'color')}
            >
                {label}
            </button>
        );
    };

    const digitBtn = (num) => {
        const isCompleted = completedDigits[num];
        return (
            <button 
                className={`vk-btn vk-btn-primary ${isCompleted ? 'vkbd-digit-completed' : ''}`}
                onClick={() => !isCompleted && handleAction(num.toString(), true)}
                disabled={isCompleted}
            >
                {num}
            </button>
        );
    };

    return (
        <div className="vkbd-container" onMouseDown={stopPropagation}>
            {/* Row 1 */}
            {modeBtn('Normal', 'digit', 'digit')}
            {digitBtn(1)}
            {digitBtn(2)}
            {digitBtn(3)}

            {/* Row 2 */}
            {modeBtn('Corner', 'outer', 'outer')}
            {digitBtn(4)}
            {digitBtn(5)}
            {digitBtn(6)}

            {/* Row 3 */}
            {modeBtn('Centre', 'inner', 'inner')}
            {digitBtn(7)}
            {digitBtn(8)}
            {digitBtn(9)}

            {/* Row 4 */}
            {modeBtn('Colour', 'color', 'color')}
            <button 
                className="vk-btn vk-btn-label vk-btn-span-3"
                onClick={() => handleAction('delete')}
            >
                Delete
            </button>

            {/* Row 5 */}
            <button 
                className="vk-btn vk-btn-label vk-btn-span-2"
                onClick={() => handleAction('undo')}
            >
                Undo
            </button>
            <button 
                className="vk-btn vk-btn-label vk-btn-span-2"
                onClick={() => handleAction('redo')}
            >
                Redo
            </button>

            {/* Row 6 */}
            <button 
                className="vk-btn vk-btn-label vk-btn-span-2"
                onClick={() => handleAction('restart')}
            >
                Restart
            </button>
            <button 
                className="vk-btn vk-btn-label vk-btn-span-2"
                onClick={() => handleAction('check')}
            >
                Check
            </button>
        </div>
    );
}



import React from 'react';
import "../new-styles.css";

export default function VirtualKeyboard({ dimensions, inputMode, completedDigits, inputHandler, simplePencilMarking }) {
    
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

    const isCompact = dimensions && dimensions.orientation === 'portrait';

    const modeBtn = (label, mode, internalMode) => {
        const isActive = inputMode === internalMode;
        return (
            <button 
                className={`btn h-12 sm:h-16 w-12 sm:w-24 active:scale-95 ${isActive ? 'btn-primary' : ''} shrink min-w-0 !px-0.5 sm:px-1`}
                onClick={() => handleAction(`input-mode-${internalMode}`, internalMode === 'color')}
            >
                <span className="text-[0.61rem] sm:text-base lg:text-xl truncate sm:normal-case font-bold sm:font-normal">{label}</span>
            </button>
        );
    };

    const digitBtn = (num) => {
        const isCompleted = completedDigits[num];
        return (
            <button 
                className={`btn btn-primary h-12 sm:h-16 w-12 sm:w-16 text-lg sm:text-2xl active:scale-95 shrink min-w-0 !px-0 ${isCompleted ? 'opacity-25 cursor-default pointer-events-none' : ''}`}
                onClick={() => !isCompleted && handleAction(num.toString(), true)}
                disabled={isCompleted}
            >
                {num}
            </button>
        );
    };

    const actions = [
        { label: 'Undo', id: 'undo' },
        { label: 'Redo', id: 'redo' },
        { label: 'Restart', id: 'restart' },
        { label: 'Check', id: 'check' },
    ];

    return (
        <div 
            className="flex flex-col gap-1 w-full max-w-[500px] mx-auto p-4 select-none bg-transparent touch-manipulation" 
            onMouseDown={stopPropagation}
            style={!isCompact && dimensions?.vkbdWidth ? { maxWidth: dimensions.vkbdWidth } : {}}
        >
            <div className={`flex ${isCompact ? 'flex-row' : 'flex-col'} gap-2 sm:gap-3 justify-center`}>
                <div className="flex gap-2 sm:gap-3 justify-center min-w-0">
                    {/* Modes Sidebar */}
                    <div className="flex flex-col gap-2 sm:gap-3 shrink min-w-0">
                        {modeBtn('Normal', 'digit', 'digit')}
                        {modeBtn('Corner', 'outer', 'outer')}
                        {modeBtn('Centre', 'inner', 'inner')}
                        {modeBtn('Colour', 'color', 'color')}
                    </div>

                    {/* Digits Grid */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink min-w-0">
                        {digitBtn(1)}
                        {digitBtn(2)}
                        {digitBtn(3)}
                        {digitBtn(4)}
                        {digitBtn(5)}
                        {digitBtn(6)}
                        {digitBtn(7)}
                        {digitBtn(8)}
                        {digitBtn(9)}
                        <button 
                            className="btn h-12 sm:h-16 active:scale-95 col-span-3 shrink min-w-0 !px-0"
                            onClick={() => handleAction('delete')}
                        >
                            <span className="text-sm sm:text-xl truncate">Delete</span>
                        </button>
                    </div>
                </div>

                {/* Actions Section */}
                {isCompact ? (
                    <div className="flex flex-col gap-2 sm:gap-3 shrink min-w-0">
                        {actions.map(a => (
                            <button 
                                key={a.id}
                                className={`btn h-12 sm:h-16 w-12 sm:w-24 active:scale-95 shrink min-w-0 !px-0.5`}
                                onClick={() => handleAction(a.id)}
                            >
                                <span className="text-[0.61rem] sm:text-base truncate sm:normal-case font-bold sm:font-normal">{a.label}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3">
                        {actions.map(a => (
                            <button 
                                key={a.id}
                                className="btn h-10 sm:h-14 active:scale-95 shrink min-w-0 !px-0"
                                onClick={() => handleAction(a.id)}
                            >
                                <span className="text-xs sm:text-xl truncate">{a.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}



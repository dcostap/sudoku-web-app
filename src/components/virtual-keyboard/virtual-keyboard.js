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
                className={`btn h-16 w-24 text-xl  active:scale-95 ${isActive ? 'btn-primary' : ''}`}
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
                className={`btn btn-primary h-16 w-16 text-2xl  active:scale-95 ${isCompleted ? 'opacity-25 cursor-default pointer-events-none' : ''}`}
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
        <div className="flex flex-col gap-1 w-full max-w-[500px] mx-auto p-4 select-none bg-transparent touch-manipulation" onMouseDown={stopPropagation}>
            <div className={`flex ${isCompact ? 'flex-row' : 'flex-col'} gap-2 justify-center`}>
                <div className="flex gap-2 justify-center">
                    {/* Modes Sidebar */}
                    <div className="flex flex-col gap-2">
                        {modeBtn('Normal', 'digit', 'digit')}
                        {modeBtn('Corner', 'outer', 'outer')}
                        {modeBtn('Centre', 'inner', 'inner')}
                        {modeBtn('Colour', 'color', 'color')}
                    </div>

                    {/* Digits Grid */}
                    <div className="grid grid-cols-3 gap-2">
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
                            className="btn h-16 text-xl col-span-3 active:scale-95"
                            onClick={() => handleAction('delete')}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* Actions Section */}
                {isCompact ? (
                    <div className="flex flex-col gap-2">
                        {actions.map(a => (
                            <button 
                                key={a.id}
                                className="btn h-16 w-24 active:scale-95"
                                onClick={() => handleAction(a.id)}
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        {actions.map(a => (
                            <button 
                                key={a.id}
                                className="btn h-14 active:scale-95"
                                onClick={() => handleAction(a.id)}
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}



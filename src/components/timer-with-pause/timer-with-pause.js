import { useState, useEffect } from 'react';

import { secondsAsHMS } from '../../lib/string-utils';

import './timer-with-pause.css';

import ButtonIcon from '../svg-sprites/button-icon';

function ElapsedTime ({intervalStartTime, endTime, pausedAt}) {
    const [tickNow, setTickNow] = useState(Date.now());

    useEffect(() => {
        if (!endTime) {
            const timer = setTimeout(() => {
                setTickNow(Date.now());
            }, 1001 - (Date.now() % 1000));
            return () => { clearTimeout(timer); }
        }
    });

    const seconds = Math.floor(((endTime || pausedAt || tickNow) - intervalStartTime) / 1000);

    return (
        <span className="text-base font-mono text-gray-700">{secondsAsHMS(seconds)}</span>
    );
}

function TimerWithPause({startTime, intervalStartTime, endTime, pausedAt, pauseHandler, hintsUsedCount}) {
    if (!startTime) {
        return null;
    }
    const hintCount = hintsUsedCount > 0
        ? (
            <span
                className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 ml-2 text-xs font-semibold text-white bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-sm"
                title={`${hintsUsedCount} hint${hintsUsedCount === 1 ? "" : "s"} used`}
            >{hintsUsedCount}</span>
        )
        : null;
    return (
        <div className="flex items-center gap-2 px-4 py-2">
            <ElapsedTime intervalStartTime={intervalStartTime} endTime={endTime} pausedAt={pausedAt} />
            {hintCount}
            <button 
                id="pause-btn" 
                type="button" 
                title="Pause timer" 
                onClick={pauseHandler}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white/50 hover:bg-white/80 border border-gray-200/50 hover:border-primary-300 transition-all duration-200 hover:shadow-md active:scale-95"
            >
                <ButtonIcon name="pause" />
            </button>
        </div>
    );
}

export default TimerWithPause;

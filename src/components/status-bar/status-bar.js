import TimerWithPause from '../timer-with-pause/timer-with-pause';
import MenuButton from '../buttons/menu-button';
import SettingsButton from '../buttons/settings-button';
import HintButton from '../buttons/hint-button';
import FullscreenButton from '../buttons/fullscreen-button';


import './status-bar.css';

const stopPropagation = (e) => e.stopPropagation();


function SiteLink () {
    // subtle link to go back to / 
    return (
        <a href="/" className="text-lg font-semibold text-gray-800 hover:text-primary-600 transition-colors duration-200">
             ❮ Go back
        </a>
    );
}

function StatusBar ({
    showTimer, startTime, intervalStartTime, endTime, pausedAt, hintsUsedCount,
    showPencilmarks, menuHandler, pauseHandler, initialDigits, mode
}) {
    const isDesignMode = mode === 'enter';

    const timer = showTimer && !isDesignMode
        ? (
            <TimerWithPause
                startTime={startTime}
                intervalStartTime={intervalStartTime}
                endTime={endTime}
                pausedAt={pausedAt}
                pauseHandler={pauseHandler}
                hintsUsedCount={hintsUsedCount}
            />
        )
        : isDesignMode ? (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                <span className="text-amber-600">✎</span>
                <span className="text-xs font-black text-amber-700 uppercase tracking-widest">Design Mode</span>
            </div>
        ) : null;
    return (
        <div className="fixed top-0 left-0 w-full h-[7.5vh]z-50" onMouseDown={stopPropagation}>
            <div className="h-full flex items-center justify-between px-4">
                <div className="hidden md:block flex-1">
                    <SiteLink />
                </div>
                {timer}
                <div className="flex items-center gap-2 ml-auto">
                    <FullscreenButton />
                    <HintButton menuHandler={menuHandler} />
                    <SettingsButton menuHandler={menuHandler} />
                    <MenuButton
                        initialDigits={initialDigits}
                        showPencilmarks={showPencilmarks}
                        menuHandler={menuHandler}
                    />
                </div>
            </div>
        </div>
    );
}

export default StatusBar;

import { modelHelpers } from '../../lib/sudoku-model';
import TimerWithPause from '../timer-with-pause/timer-with-pause';
import MenuButton from '../buttons/menu-button';
import SettingsButton from '../buttons/settings-button';
import HintButton from '../buttons/hint-button';
import FullscreenButton from '../buttons/fullscreen-button';


const stopPropagation = (e) => e.stopPropagation();


function SiteLink () {
    return (
        <a href="/" className="retro-link text-xs font-bold tracking-widest uppercase">
             ❮ Sudoku
        </a>
    );
}

function StatusBar ({
    showTimer, startTime, intervalStartTime, endTime, pausedAt, hintsUsedCount,
    showPencilmarks, menuHandler, pauseHandler, initialDigits, mode
}) {
    const isDesignMode = mode === 'enter';
    const nytInfo = !isDesignMode && initialDigits ? modelHelpers.getNYTInfo(initialDigits) : null;

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
            <div className="tag-pill">
                <span className="text-theme-accent text-sm font-bold tracking-[0.2em]">Design</span>
                <span className="text-sm opacity-70 uppercase tracking-widest">Mode</span>
            </div>
        ) : null;

    const nytBadge = nytInfo ? (
        <div className="tag-pill hidden lg:flex">
            <span className="text-theme-accent text-sm font-bold tracking-[0.2em]">NYT</span>
            <span className="text-sm opacity-70">
                {nytInfo.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="tag-compact">
                {nytInfo.difficulty}
            </span>
        </div>
    ) : null;

    return (
        <nav className="app-nav" onMouseDown={stopPropagation}>
            <div className="app-nav-inner">
                <div className="app-nav-left">
                    <SiteLink />
                    {nytBadge}
                </div>
                <div className="app-nav-center">
                    {timer}
                </div>
                <div className="app-nav-right">
                    <div className="hidden md:flex items-center gap-2">
                        <FullscreenButton />
                        <HintButton menuHandler={menuHandler} />
                        <SettingsButton menuHandler={menuHandler} />
                    </div>
                    <div className="hidden md:block h-6 border-l border-theme-border mx-2"></div>
                    <MenuButton
                        initialDigits={initialDigits}
                        showPencilmarks={showPencilmarks}
                        menuHandler={menuHandler}
                    />
                </div>
            </div>
        </nav>
    );
}

export default StatusBar;

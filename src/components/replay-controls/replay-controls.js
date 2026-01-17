import { useState, useEffect, useCallback } from 'react';
import './replay-controls.css';

function ReplayControls({ grid, setGrid, modelHelpers }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per step
    
    const replayStep = grid.get('replayStep');
    const replayHistory = grid.get('replayHistory');
    const totalSteps = replayHistory.size - 1;
    const startTime = grid.get('startTime');
    const endTime = grid.get('endTime');
    const solved = grid.get('solved');
    
    const currentSnapshotTime = grid.get('currentSnapshotTime') || 0;
    const totalTime = endTime - startTime;
    
    const formatTime = (ms) => {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    const stepForward = useCallback(() => {
        setGrid(g => modelHelpers.replayStepForward(g));
    }, [setGrid, modelHelpers]);
    
    const stepBackward = useCallback(() => {
        setGrid(g => modelHelpers.replayStepBackward(g));
    }, [setGrid, modelHelpers]);
    
    const goToStart = useCallback(() => {
        setGrid(g => modelHelpers.replayGoToStep(g, 0));
    }, [setGrid, modelHelpers]);
    
    const goToEnd = useCallback(() => {
        setGrid(g => modelHelpers.replayGoToStep(g, totalSteps));
    }, [setGrid, modelHelpers, totalSteps]);
    
    const handleSliderChange = useCallback((e) => {
        setIsPlaying(false);
        const step = parseInt(e.target.value, 10);
        setGrid(g => modelHelpers.replayGoToStep(g, step));
    }, [setGrid, modelHelpers]);
    
    const togglePlayback = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, []);
    
    // Auto-play functionality
    useEffect(() => {
        if (!isPlaying) return;
        
        const interval = setInterval(() => {
            setGrid(g => {
                const currentStep = g.get('replayStep');
                const history = g.get('replayHistory');
                
                if (currentStep >= history.size - 1) {
                    setIsPlaying(false);
                    return g;
                }
                
                return modelHelpers.replayStepForward(g);
            });
        }, playbackSpeed);
        
        return () => clearInterval(interval);
    }, [isPlaying, playbackSpeed, setGrid, modelHelpers]);
    
    const statusText = solved ? 'Solved' : 'Abandoned';
    const statusClass = solved ? 'status-solved' : 'status-abandoned';
    
    const stopPropagation = (e) => e.stopPropagation();
    
    return (
        <div className="replay-controls" onMouseDown={stopPropagation}>
            <div className="replay-header">
                <div className="flex items-center gap-3">
                    <h2 className="hidden sm:block">Replay Mode</h2>
                    <span className="replay-step-info">
                        Move {replayStep} of {totalSteps}
                    </span>
                    <span className={`replay-status ${statusClass}`}>{statusText}</span>
                    <span className="replay-time">
                        {formatTime(currentSnapshotTime)} / {formatTime(totalTime)}
                    </span>
                </div>
                <a href="/" className="replay-btn-home">
                    Exit Replay
                </a>
            </div>
            
            <div className="replay-main-controls">
                <div className="replay-buttons">
                    <button 
                        onClick={goToStart} 
                        disabled={replayStep === 0}
                        title="Go to start"
                        className="replay-btn"
                    >
                        ⏮
                    </button>
                    <button 
                        onClick={stepBackward} 
                        disabled={replayStep === 0}
                        title="Previous move"
                        className="replay-btn"
                    >
                        ◀
                    </button>
                    <button 
                        onClick={togglePlayback}
                        title={isPlaying ? "Pause" : "Play"}
                        className="replay-btn replay-btn-play"
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button 
                        onClick={stepForward} 
                        disabled={replayStep === totalSteps}
                        title="Next move"
                        className="replay-btn"
                    >
                        ▶
                    </button>
                    <button 
                        onClick={goToEnd} 
                        disabled={replayStep === totalSteps}
                        title="Go to end"
                        className="replay-btn"
                    >
                        ⏭
                    </button>
                    
                    <div className="replay-speed-control">
                        <select 
                            value={playbackSpeed} 
                            onChange={(e) => setPlaybackSpeed(parseInt(e.target.value, 10))}
                            className="replay-speed-select"
                        >
                            <option value={2000}>0.5x</option>
                            <option value={1000}>1x</option>
                            <option value={500}>2x</option>
                            <option value={250}>4x</option>
                        </select>
                    </div>
                </div>

                <div className="replay-slider-container">
                    <input 
                        type="range" 
                        min="0" 
                        max={totalSteps}
                        value={replayStep}
                        onInput={handleSliderChange}
                        onMouseDown={() => setIsPlaying(false)}
                        onTouchStart={() => setIsPlaying(false)}
                        className="replay-slider"
                    />
                    <div className="replay-indicators">
                        {replayHistory.map((step, index) => {
                            const actionType = step.a;
                            if (!actionType) return null;
                            
                            const position = (index / totalSteps) * 100;
                            return (
                                <div 
                                    key={index} 
                                    className={`replay-indicator indicator-${actionType}`}
                                    style={{ left: `${position}%` }}
                                />
                            );
                        }).toArray()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReplayControls;

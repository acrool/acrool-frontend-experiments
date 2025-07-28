import React, {useCallback,useState} from 'react';

export interface StreamVolumeControlProps {
    /** 初始音量 (0-100) */
    initialVolume?: number
    /** 音量變化回調 */
    onVolumeChange?: (volume: number, isMuted: boolean) => void
    /** 是否顯示音量百分比 */
    showPercentage?: boolean
    /** 自定義樣式 */
    className?: string
}

const StreamVolumeControl: React.FC<StreamVolumeControlProps> = ({
    initialVolume = 50,
    onVolumeChange,
    showPercentage = true,
    className = '',
}) => {
    const [volume, setVolume] = useState(initialVolume);
    const [isMuted, setIsMuted] = useState(false);
    const [lastVolume, setLastVolume] = useState(initialVolume);

    const handleVolumeChange = useCallback((newVolume: number) => {
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
        }
        onVolumeChange?.(newVolume, isMuted && newVolume === 0);
    }, [isMuted, onVolumeChange]);

    const handleMuteToggle = useCallback(() => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        
        if (newMuted) {
            setLastVolume(volume);
            setVolume(0);
            onVolumeChange?.(0, true);
        } else {
            const restoreVolume = lastVolume > 0 ? lastVolume : 50;
            setVolume(restoreVolume);
            onVolumeChange?.(restoreVolume, false);
        }
    }, [isMuted, volume, lastVolume, onVolumeChange]);

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return '🔇';
        if (volume < 30) return '🔈';
        if (volume < 70) return '🔉';
        return '🔊';
    };

    return (
        <div className={`volume-control ${className}`} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            minWidth: '280px',
            userSelect: 'none',
        }}>
            {/* 靜音按鈕 */}
            <button
                onClick={handleMuteToggle}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                }}
                title={isMuted ? '取消靜音' : '靜音'}
            >
                {getVolumeIcon()}
            </button>

            {/* 音量滑動條 */}
            <div style={{flex: 1, position: 'relative'}}>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        background: `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${volume}%, #ddd ${volume}%, #ddd 100%)`,
                        outline: 'none',
                        cursor: 'pointer',
                        WebkitAppearance: 'none',
                    }}
                    className="volume-slider"
                />
                <style>{`
                    .volume-slider::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: #4CAF50;
                        cursor: pointer;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                        transition: all 0.2s ease;
                    }
                    .volume-slider::-webkit-slider-thumb:hover {
                        transform: scale(1.1);
                        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
                    }
                    .volume-slider::-moz-range-thumb {
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: #4CAF50;
                        cursor: pointer;
                        border: none;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                    }
                `}</style>
            </div>

            {/* 音量百分比 */}
            {showPercentage && (
                <div style={{
                    minWidth: '45px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#666',
                    fontFamily: 'monospace',
                }}>
                    {isMuted ? '靜音' : `${volume}%`}
                </div>
            )}
        </div>
    );
};

export default StreamVolumeControl; 
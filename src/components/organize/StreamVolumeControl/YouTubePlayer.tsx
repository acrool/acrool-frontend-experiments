import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import StreamVolumeControl from './StreamVolumeControl';

// YouTube Player API 類型定義
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export interface YouTubePlayerProps {
    /** YouTube 影片 ID */
    videoId: string;
    /** 初始音量 (0-100) */
    initialVolume?: number;
    /** 是否顯示音量百分比 */
    showPercentage?: boolean;
    /** 自定義類名 */
    className?: string;
}


/**
 * Youtube 播放器，使用 Youtube API
 * @param videoId
 * @param initialVolume
 * @param showPercentage
 * @param className
 */
const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
    videoId,
    initialVolume = 50,
    showPercentage = true,
    className,
}) => {
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [apiLoaded, setApiLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const initializingRef = useRef(false); // 防止重複初始化

    // 載入 YouTube Player API
    useEffect(() => {
        // 檢查 API 是否已經載入
        if (window.YT && window.YT.Player) {
            setApiLoaded(true);
            return;
        }

        // 檢查是否已經有載入中的腳本
        const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
        if (existingScript) {
            // 如果腳本已存在，等待其載入完成
            const checkApiReady = () => {
                if (window.YT && window.YT.Player) {
                    setApiLoaded(true);
                } else {
                    setTimeout(checkApiReady, 100);
                }
            };
            checkApiReady();
            return;
        }

        // 載入新的腳本
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;

        // 監聽腳本載入完成
        script.onload = () => {
            console.log('YouTube API 腳本載入完成');
        };

        script.onerror = () => {
            console.error('YouTube API 腳本載入失敗');
        };

        document.body.appendChild(script);

        // 設置全域回調
        const originalCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            console.log('YouTube API 已準備就緒');
            setApiLoaded(true);
            // 如果之前有回調，也要執行
            if (originalCallback && typeof originalCallback === 'function') {
                originalCallback();
            }
        };

        return () => {
            // 清理時不移除腳本，因為其他元件可能也需要使用
            // 重置 API 載入狀態
            setApiLoaded(false);
        };
    }, []);

    // 初始化 YouTube Player
    useEffect(() => {
        if (!apiLoaded || !containerRef.current || initializingRef.current) return;

        initializingRef.current = true; // 設置初始化標誌

        const container = containerRef.current;
        const playerId = `youtube-player-${Date.now()}`; // 確保 ID 唯一

        // 創建播放器容器
        const playerDiv = document.createElement('div');
        playerDiv.id = playerId;
        playerDiv.style.width = '100%';
        playerDiv.style.height = '100%';

        // 確保容器存在才添加
        if (container.parentNode) {
            container.appendChild(playerDiv);
        } else {
            console.warn('YouTube 播放器容器已不存在');
            return;
        }

        let isDestroyed = false;

        try {
            playerRef.current = new window.YT.Player(playerId, {
                width: '100%',
                height: '100%',
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    controls: 1,
                    rel: 0,
                    modestbranding: 1,
                    fs: 1,
                },
                events: {
                    onReady: (event: any) => {
                        if (!isDestroyed) {
                            console.log('YouTube Player 已準備就緒');
                            setIsPlayerReady(true);
                            setHasError(false);
                            // 設置初始音量
                            try {
                                event.target.setVolume(initialVolume);
                            } catch (volumeError) {
                                console.warn('設置初始音量失敗:', volumeError);
                            }
                        }
                    },
                    onError: (error: any) => {
                        console.error('YouTube Player 錯誤:', error);
                        setIsPlayerReady(false);
                        setHasError(true);
                    },
                },
            });
        } catch (error) {
            console.error('建立 YouTube Player 失敗:', error);
            setIsPlayerReady(false);
            setHasError(true);
            initializingRef.current = false; // 重置標誌，允許重試
        }

        return () => {
            isDestroyed = true;
            initializingRef.current = false; // 重置初始化標誌
            setIsPlayerReady(false);
            setHasError(false);

            // 安全清理播放器
            try {
                if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                    playerRef.current.destroy();
                    playerRef.current = null;
                }
            } catch (error) {
                console.warn('清理 YouTube Player 時發生錯誤:', error);
            }

            // 安全清理 DOM 元素
            try {
                const playerElement = document.getElementById(playerId);
                if (playerElement && playerElement.parentNode) {
                    playerElement.parentNode.removeChild(playerElement);
                }
            } catch (error) {
                console.warn('清理播放器 DOM 元素時發生錯誤:', error);
            }
        };
    }, [apiLoaded, videoId, initialVolume]);

    const handleVolumeChange = (volume: number, isMuted: boolean) => {
        console.log('YouTube 音量調整:', { volume, isMuted });

        if (!playerRef.current || !isPlayerReady) {
            console.warn('YouTube Player 尚未準備就緒');
            return;
        }

        try {
            if (isMuted) {
                playerRef.current.mute();
                console.log('YouTube 已靜音');
            } else {
                playerRef.current.unMute();
                playerRef.current.setVolume(volume);
                console.log(`YouTube 音量設置為 ${volume}%`);
            }
        } catch (error) {
            console.error('YouTube 音量控制錯誤:', error);
        }
    };

    return (
        <Container className={className}>
            {/* YouTube 播放器區域 */}
            <PlayerArea ref={containerRef}>
                {!isPlayerReady && !hasError && (
                    <LoadingOverlay>
                        <div style={{ marginBottom: '10px' }}>🔄</div>
                        <div>載入 YouTube 播放器中...</div>
                    </LoadingOverlay>
                )}

                {hasError && (
                    <ErrorOverlay>
                        <ErrorTitle>❌</ErrorTitle>
                        <div>YouTube 播放器載入失敗</div>
                        <ErrorMessage>
                            請檢查網路連接或重新整理頁面
                        </ErrorMessage>
                    </ErrorOverlay>
                )}

                <StatusBadge $hasError={hasError}>
                    🔴 YouTube {hasError ? '錯誤' : isPlayerReady ? '播放中' : '載入中'}
                </StatusBadge>
            </PlayerArea>

            {/* 音量控制區域 */}
            <ControlArea>
                <ControlTitle>
                    🎵 YouTube 音量控制
                </ControlTitle>

                <StreamVolumeControl
                    initialVolume={initialVolume}
                    showPercentage={showPercentage}
                    onVolumeChange={handleVolumeChange}
                />

                <InfoBox>
                    <InfoTitle>
                        🎬 YouTube Player API
                    </InfoTitle>
                    <InfoDescription>
                        真實控制 YouTube 播放器音量<br/>
                        使用 player.setVolume() 和 mute()
                    </InfoDescription>
                </InfoBox>
            </ControlArea>
        </Container>
    );
};

export default YouTubePlayer;





// Styled Components
const Container = styled.div`
    display: flex;
    gap: 20px;
    align-items: flex-start;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const PlayerArea = styled.div`
    flex: 1;
    background: #000;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    aspect-ratio: 16/9;
    max-height: 500px;
`;

const LoadingOverlay = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 16px;
    text-align: center;
    z-index: 5;
`;

const ErrorOverlay = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ff6b6b;
    font-size: 16px;
    text-align: center;
    z-index: 5;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 8px;
`;

const ErrorTitle = styled.div`
    margin-bottom: 10px;
`;

const ErrorMessage = styled.div`
    font-size: 12px;
    margin-top: 8px;
    color: #ffcccc;
`;

const StatusBadge = styled.div<{ $hasError: boolean }>`
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    z-index: 10;
`;

const ControlArea = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    min-width: 300px;
`;

const ControlTitle = styled.h3`
    margin: 0 0 16px 0;
    font-size: 18px;
    color: #333;
    text-align: center;
`;

const InfoBox = styled.div`
    margin-top: 16px;
    padding: 12px;
    background: #fff3cd;
    border-radius: 8px;
    font-size: 14px;
    color: #856404;
    text-align: center;
    border: 1px solid #ffeaa7;
`;

const InfoTitle = styled.p`
    margin: 0 0 8px 0;
    font-weight: 500;
`;

const InfoDescription = styled.p`
    margin: 0;
    font-size: 12px;
`;

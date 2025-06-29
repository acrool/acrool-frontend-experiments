import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useEffect, useState } from 'react';

import StreamVolumeControl from './StreamVolumeControl';

// YouTube Player API 類型定義
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

const meta = {
    title: 'Organize/StreamVolumeControl',
    component: StreamVolumeControl,
    parameters: {
        docs: {
            description: {
                component: '串流直播音量控制元件，支持音量調節、靜音功能，可與 YouTube 和 HTML5 Video 集成'
            },
        },
    },
    tags: ['autodocs'],
    args: {},
} satisfies Meta<typeof StreamVolumeControl>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本音量控制元件展示
export const Primary: Story = {
    render: (args) => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            background: '#f8f9fa',
            minHeight: '200px',
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
                <h3 style={{
                    margin: '0 0 20px 0',
                    textAlign: 'center',
                    color: '#333',
                }}>
                    🎵 音量控制元件
                </h3>
                <StreamVolumeControl
                    {...args}
                    onVolumeChange={(volume, isMuted) => {
                        console.log('音量變化:', { volume, isMuted });
                    }}
                />
            </div>
        </div>
    ),
    args: {
        initialVolume: 50,
        showPercentage: true,
    },
};

// YouTube 直播音量控制
export const YouTubeStream: Story = {
    render: (args) => {
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

            // 安全清理舊的內容


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
                    videoId: 'dQw4w9WgXcQ', // 經典範例影片
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
                                    event.target.setVolume(args.initialVolume || 50);
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
        }, [apiLoaded, args.initialVolume]);

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
            <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
                {/* YouTube 播放器區域 */}
                <div
                    ref={containerRef}
                    style={{
                        flex: 1,
                        background: '#000',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        aspectRatio: '16/9',
                        minWidth: '400px',
                    }}
                >
                    {!isPlayerReady && !hasError && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            fontSize: '16px',
                            textAlign: 'center',
                            zIndex: 5,
                        }}>
                            <div style={{ marginBottom: '10px' }}>🔄</div>
                            <div>載入 YouTube 播放器中...</div>
                        </div>
                    )}

                    {hasError && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#ff6b6b',
                            fontSize: '16px',
                            textAlign: 'center',
                            zIndex: 5,
                            background: 'rgba(0, 0, 0, 0.8)',
                            padding: '20px',
                            borderRadius: '8px',
                        }}>
                            <div style={{ marginBottom: '10px' }}>❌</div>
                            <div>YouTube 播放器載入失敗</div>
                            <div style={{ fontSize: '12px', marginTop: '8px', color: '#ffcccc' }}>
                                請檢查網路連接或重新整理頁面
                            </div>
                        </div>
                    )}

                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        zIndex: 10,
                    }}>
                        🔴 YouTube {hasError ? '錯誤' : isPlayerReady ? '播放中' : '載入中'}
                    </div>
                </div>

                {/* 音量控制區域 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '20px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    minWidth: '300px',
                }}>
                    <h3 style={{
                        margin: '0 0 16px 0',
                        fontSize: '18px',
                        color: '#333',
                        textAlign: 'center',
                    }}>
                        🎵 YouTube 音量控制
                    </h3>

                    <StreamVolumeControl
                        {...args}
                        onVolumeChange={handleVolumeChange}
                    />

                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: '#fff3cd',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#856404',
                        textAlign: 'center',
                        border: '1px solid #ffeaa7',
                    }}>
                        <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
                            🎬 YouTube Player API
                        </p>
                        <p style={{ margin: 0, fontSize: '12px' }}>
                            真實控制 YouTube 播放器音量<br/>
                            使用 player.setVolume() 和 mute()
                        </p>
                    </div>
                </div>
            </div>
        );
    },
    args: {
        initialVolume: 60,
        showPercentage: true,
    },
};

// HTML5 Video 音量控制
export const VideoStream: Story = {
    render: (args) => {
        const videoRef = useRef<HTMLVideoElement>(null);
        const [isPlayerReady, setIsPlayerReady] = useState(false);
        const [hasError, setHasError] = useState(false);

        const handleVolumeChange = (volume: number, isMuted: boolean) => {
            console.log('Video 音量調整:', { volume, isMuted });

            if (!videoRef.current || !isPlayerReady) {
                console.warn('Video 播放器尚未準備就緒');
                return;
            }

            try {
                if (isMuted) {
                    videoRef.current.muted = true;
                    console.log('Video 已靜音');
                } else {
                    videoRef.current.muted = false;
                    videoRef.current.volume = volume / 100; // video.volume 範圍是 0-1
                    console.log(`Video 音量設置為 ${volume}%`);
                }
            } catch (error) {
                console.error('Video 音量控制錯誤:', error);
            }
        };

        return (
            <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
                {/* Video 播放器區域 */}
                <div style={{
                    flex: 1,
                    background: '#000',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    aspectRatio: '16/9',
                    minWidth: '400px',
                }}>
                    <video
                        ref={videoRef}
                        width="100%"
                        height="100%"
                        controls
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                        onLoadedData={() => {
                            console.log('Video 載入完成');
                            setIsPlayerReady(true);
                            setHasError(false);
                            if (videoRef.current) {
                                videoRef.current.volume = (args.initialVolume || 50) / 100;
                            }
                        }}
                        onError={(e) => {
                            console.error('Video 載入錯誤:', e);
                            setHasError(true);
                            setIsPlayerReady(false);
                        }}
                    >
                        <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
                        <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4" type="video/mp4" />
                        您的瀏覽器不支援 video 標籤。
                    </video>

                    {!isPlayerReady && !hasError && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            fontSize: '16px',
                            textAlign: 'center',
                            zIndex: 5,
                        }}>
                            <div style={{ marginBottom: '10px' }}>🔄</div>
                            <div>載入 MP4 影片中...</div>
                        </div>
                    )}

                    {hasError && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#ff6b6b',
                            fontSize: '16px',
                            textAlign: 'center',
                            zIndex: 5,
                            background: 'rgba(0, 0, 0, 0.8)',
                            padding: '20px',
                            borderRadius: '8px',
                        }}>
                            <div style={{ marginBottom: '10px' }}>❌</div>
                            <div>影片載入失敗</div>
                            <div style={{ fontSize: '12px', marginTop: '8px', color: '#ffcccc' }}>
                                請檢查網路連接或更換影片源
                            </div>
                        </div>
                    )}

                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        zIndex: 10,
                    }}>
                        🎬 MP4 Video {isPlayerReady ? '播放中' : '載入中'}
                    </div>
                </div>

                {/* 音量控制區域 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '20px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    minWidth: '300px',
                }}>
                    <h3 style={{
                        margin: '0 0 16px 0',
                        fontSize: '18px',
                        color: '#333',
                        textAlign: 'center',
                    }}>
                        🎵 Video 音量控制
                    </h3>

                    <StreamVolumeControl
                        {...args}
                        onVolumeChange={handleVolumeChange}
                    />

                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: '#d1ecf1',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#0c5460',
                        textAlign: 'center',
                        border: '1px solid #bee5eb',
                    }}>
                        <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
                            📹 HTML5 Video
                        </p>
                        <p style={{ margin: 0, fontSize: '12px' }}>
                            真實控制 Video 標籤音量<br/>
                            使用 video.volume 和 video.muted
                        </p>
                    </div>
                </div>
            </div>
        );
    },
    args: {
        initialVolume: 70,
        showPercentage: true,
    },
};

// 本地 MP4 文件使用指南
export const LocalVideoGuide: Story = {
    render: (args) => {
        const videoRef = useRef<HTMLVideoElement>(null);
        const [isPlayerReady, setIsPlayerReady] = useState(false);
        const [hasError, setHasError] = useState(false);

        const handleVolumeChange = (volume: number, isMuted: boolean) => {
            console.log('本地 Video 音量調整:', { volume, isMuted });

            if (!videoRef.current || !isPlayerReady) {
                console.warn('本地 Video 播放器尚未準備就緒');
                return;
            }

            try {
                if (isMuted) {
                    videoRef.current.muted = true;
                    console.log('本地 Video 已靜音');
                } else {
                    videoRef.current.muted = false;
                    videoRef.current.volume = volume / 100;
                    console.log(`本地 Video 音量設置為 ${volume}%`);
                }
            } catch (error) {
                console.error('本地 Video 音量控制錯誤:', error);
            }
        };

        return (
            <div style={{ padding: '20px' }}>
                {/* 使用指南 */}
                <div style={{
                    marginBottom: '20px',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    border: '2px solid #dee2e6',
                }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#495057' }}>
                        📁 使用本地 MP4 文件
                    </h4>
                    <div style={{ marginBottom: '12px' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6c757d' }}>
                            <strong>步驟 1:</strong> 將您的 MP4 文件放置在 <code style={{ background: '#e9ecef', padding: '2px 6px', borderRadius: '4px' }}>public/</code> 資料夾中
                        </p>
                        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6c757d' }}>
                            <strong>步驟 2:</strong> 修改 video src 為您的文件路徑
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#868e96' }}>
                            範例：<code style={{ background: '#e9ecef', padding: '2px 6px', borderRadius: '4px' }}>src="/your-video.mp4"</code>
                        </p>
                    </div>
                                         <div style={{
                         padding: '12px',
                         background: '#fff3cd',
                         borderRadius: '6px',
                         border: '1px solid #ffeaa7',
                         marginBottom: '8px',
                     }}>
                         <p style={{ margin: 0, fontSize: '12px', color: '#856404' }}>
                             💡 <strong>提示:</strong> 目前使用線上範例影片，您可以替換為自己的 MP4 文件
                         </p>
                     </div>
                     <div style={{
                         padding: '12px',
                         background: '#d1ecf1',
                         borderRadius: '6px',
                         border: '1px solid #bee5eb',
                     }}>
                         <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#0c5460', fontWeight: '500' }}>
                             📝 本地文件範例:
                         </p>
                         <code style={{
                             display: 'block',
                             background: '#e9ecef',
                             padding: '8px',
                             borderRadius: '4px',
                             fontSize: '11px',
                             color: '#495057'
                         }}>
                             {`<source src="/my-video.mp4" type="video/mp4" />`}
                         </code>
                     </div>
                </div>

                {/* 播放器區域 */}
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-start',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}>
                    <div style={{
                        flex: 1,
                        background: '#000',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        aspectRatio: '16/9',
                        minWidth: '400px',
                    }}>
                        <video
                            ref={videoRef}
                            width="100%"
                            height="100%"
                            controls
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                                                         onLoadedData={() => {
                                 console.log('本地 Video 載入完成');
                                 setIsPlayerReady(true);
                                 setHasError(false);
                                 if (videoRef.current) {
                                     videoRef.current.volume = (args.initialVolume || 50) / 100;
                                 }
                             }}
                             onError={(e) => {
                                 console.error('本地 Video 載入錯誤:', e);
                                 setHasError(true);
                                 setIsPlayerReady(false);
                             }}
                                                 >
                             {/* 這裡可以替換為您的本地文件 */}
                             <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
                             <source src="https://file-examples.com/storage/fe86f21216c66346d629b/2017/10/file_example_MP4_480_1_5MG.mp4" type="video/mp4" />
                             <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4" type="video/mp4" />
                             您的瀏覽器不支援 video 標籤。
                         </video>

                                                 {!hasError && (
                             <div style={{
                                 position: 'absolute',
                                 top: '10px',
                                 left: '10px',
                                 background: 'rgba(0, 0, 0, 0.8)',
                                 color: 'white',
                                 padding: '6px 12px',
                                 borderRadius: '6px',
                                 fontSize: '14px',
                                 fontWeight: '500',
                                 zIndex: 10,
                             }}>
                                 📁 本地 MP4 {isPlayerReady ? '播放中' : '載入中'}
                             </div>
                         )}

                         {hasError && (
                             <div style={{
                                 position: 'absolute',
                                 top: '50%',
                                 left: '50%',
                                 transform: 'translate(-50%, -50%)',
                                 color: '#ff6b6b',
                                 fontSize: '16px',
                                 textAlign: 'center',
                                 zIndex: 5,
                                 background: 'rgba(0, 0, 0, 0.9)',
                                 padding: '24px',
                                 borderRadius: '12px',
                                 maxWidth: '300px',
                             }}>
                                 <div style={{ marginBottom: '12px' }}>❌</div>
                                 <div style={{ marginBottom: '8px' }}>影片載入失敗</div>
                                 <div style={{ fontSize: '12px', color: '#ffcccc', lineHeight: '1.4' }}>
                                     1. 檢查網路連接<br/>
                                     2. 將 MP4 文件放入 public/ 資料夾<br/>
                                     3. 使用 src="/your-video.mp4"
                                 </div>
                             </div>
                         )}
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '20px',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        minWidth: '300px',
                    }}>
                        <h3 style={{
                            margin: '0 0 16px 0',
                            fontSize: '18px',
                            color: '#333',
                            textAlign: 'center',
                        }}>
                            🎵 本地影片音量控制
                        </h3>

                        <StreamVolumeControl
                            {...args}
                            onVolumeChange={handleVolumeChange}
                        />

                        <div style={{
                            marginTop: '16px',
                            padding: '12px',
                            background: '#f0f8ff',
                            borderRadius: '8px',
                            fontSize: '14px',
                            color: '#666',
                            textAlign: 'center',
                            border: '1px solid #e1ecf4',
                        }}>
                            <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
                                💡 使用提示
                            </p>
                            <p style={{ margin: 0, fontSize: '12px' }}>
                                調整滑動條控制音量<br/>
                                點擊音量圖標進行靜音/取消靜音
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    args: {
        initialVolume: 60,
        showPercentage: true,
    },
};

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
                component: '串流直播音量控制元件，支持音量調節、靜音功能，可與 YouTube 等直播平台集成'
            },
        },
    },
    tags: ['autodocs'],
    args: {},
} satisfies Meta<typeof StreamVolumeControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        initialVolume: 50,
        showPercentage: true,
    },
};

export const WithoutPercentage: Story = {
    args: {
        initialVolume: 75,
        showPercentage: false,
    },
};

export const LowVolume: Story = {
    args: {
        initialVolume: 15,
        showPercentage: true,
    },
};

export const HighVolume: Story = {
    args: {
        initialVolume: 90,
        showPercentage: true,
    },
};

// 真實 YouTube 音量控制的包裝元件
const StreamSimulator: React.FC<{
    streamerId: string;
    streamerName: string;
    children: React.ReactNode;
}> = ({ streamerId, streamerName, children }) => {
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [apiLoaded, setApiLoaded] = useState(false);

    // 載入 YouTube Player API
    useEffect(() => {
        if (window.YT && window.YT.Player) {
            setApiLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);

        window.onYouTubeIframeAPIReady = () => {
            setApiLoaded(true);
        };

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    // 初始化 YouTube Player
    useEffect(() => {
        if (!apiLoaded || !containerRef.current) return;

        const playerId = `youtube-player-${streamerId}`;

        // 創建播放器容器
        const playerDiv = document.createElement('div');
        playerDiv.id = playerId;
        containerRef.current.appendChild(playerDiv);

        playerRef.current = new window.YT.Player(playerId, {
            width: '100%',
            height: '100%',
            videoId: streamerId,
            playerVars: {
                autoplay: 0,
                controls: 1,
                rel: 0,
                modestbranding: 1,
                fs: 1,
            },
            events: {
                onReady: (event: any) => {
                    console.log(`${streamerName} YouTube Player 已準備就緒`);
                    setIsPlayerReady(true);
                    // 設置初始音量
                    event.target.setVolume(50);
                },
                onError: (error: any) => {
                    console.error(`${streamerName} YouTube Player 錯誤:`, error);
                },
            },
        });

        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [apiLoaded, streamerId, streamerName]);

    const handleVolumeChange = (volume: number, isMuted: boolean) => {
        console.log(`${streamerName} 直播音量調整:`, { volume, isMuted });

        if (!playerRef.current || !isPlayerReady) {
            console.warn('YouTube Player 尚未準備就緒');
            return;
        }

        try {
            if (isMuted) {
                playerRef.current.mute();
                console.log(`${streamerName} 已靜音`);
            } else {
                playerRef.current.unMute();
                playerRef.current.setVolume(volume);
                console.log(`${streamerName} 音量設置為 ${volume}%`);
            }
        } catch (error) {
            console.error(`${streamerName} 音量控制錯誤:`, error);
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
            {/* 直播模擬區域 */}
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
                {!isPlayerReady && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontSize: '16px',
                        textAlign: 'center',
                    }}>
                        <div style={{ marginBottom: '10px' }}>🔄</div>
                        <div>載入 {streamerName} 直播中...</div>
                    </div>
                )}

                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    zIndex: 10,
                }}>
                    🔴 {streamerName} {isPlayerReady ? '直播中' : '準備中'}
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
                    🎵 直播音量控制
                </h3>

                {React.cloneElement(children as React.ReactElement<any>, {
                    onVolumeChange: handleVolumeChange,
                })}

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
                        點擊音量圖標進行靜音/取消靜音<br/>
                        <span style={{ color: '#28a745' }}>🎬 真實控制 YouTube 播放器音量</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

// 老皮直播模擬
export const WithLaoPiStream: Story = {
    render: (args) => (
        <StreamSimulator
            streamerId="dQw4w9WgXcQ" // 使用經典 YouTube 影片 ID 作為範例
            streamerName="老皮"
        >
            <StreamVolumeControl {...args} />
        </StreamSimulator>
    ),
    args: {
        initialVolume: 60,
        showPercentage: true,
    },
};

// 滷蛋直播模擬
export const WithLuDanStream: Story = {
    render: (args) => (
        <StreamSimulator
            streamerId="jNQXAC9IVRw" // 另一個範例影片 ID
            streamerName="滷蛋"
        >
            <StreamVolumeControl {...args} />
        </StreamSimulator>
    ),
    args: {
        initialVolume: 45,
        showPercentage: true,
    },
};

// 丁特直播模擬
export const WithDingTeStream: Story = {
    render: (args) => (
        <StreamSimulator
            streamerId="L_jWHffIx5E" // 另一個範例影片 ID
            streamerName="丁特"
        >
            <StreamVolumeControl {...args} />
        </StreamSimulator>
    ),
    args: {
        initialVolume: 70,
        showPercentage: true,
    },
};

import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import StreamVolumeControl from './StreamVolumeControl';

interface LocalVideoGuideProps {
    videoSources: string | string[];
    initialVolume?: number;
    showPercentage?: boolean;
    showGuide?: boolean;
}


/**
 * 本地影片
 * @param videoSources
 * @param initialVolume
 * @param showPercentage
 * @param showGuide
 */
const LocalVideoGuide: React.FC<LocalVideoGuideProps> = ({
    videoSources,
    initialVolume = 60,
    showPercentage = true,
}) => {
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

    const sources = Array.isArray(videoSources) ? videoSources : [videoSources];

    return (
        <Container>

            <PlayerContainer>
                <VideoWrapper>
                    <Video
                        ref={videoRef}
                        width="100%"
                        height="100%"
                        controls
                        onLoadedData={() => {
                            console.log('本地 Video 載入完成');
                            setIsPlayerReady(true);
                            setHasError(false);
                            if (videoRef.current) {
                                videoRef.current.volume = initialVolume / 100;
                            }
                        }}
                        onError={(e) => {
                            console.error('本地 Video 載入錯誤:', e);
                            setHasError(true);
                            setIsPlayerReady(false);
                        }}
                    >
                        {sources.map((src, index) => (
                            <source key={index} src={src} type="video/mp4" />
                        ))}
                        您的瀏覽器不支援 video 標籤。
                    </Video>

                    {!hasError && (
                        <VideoStatusBadge>
                            📁 本地 MP4 {isPlayerReady ? '播放中' : '載入中'}
                        </VideoStatusBadge>
                    )}

                    {hasError && (
                        <ErrorOverlay>
                            <div className="error-icon">❌</div>
                            <div className="error-title">影片載入失敗</div>
                            <div className="error-message">
                                1. 檢查網路連接<br/>
                                2. 將 MP4 文件放入 public/ 資料夾<br/>
                                3. 使用 src="/your-video.mp4"
                            </div>
                        </ErrorOverlay>
                    )}
                </VideoWrapper>

                <ControlsWrapper>
                    <ControlsTitle>🎵 本地影片音量控制</ControlsTitle>

                    <StreamVolumeControl
                        initialVolume={initialVolume}
                        showPercentage={showPercentage}
                        onVolumeChange={handleVolumeChange}
                    />

                    <TipsBox>
                        <p>💡 使用提示</p>
                        <p>
                            調整滑動條控制音量<br/>
                            點擊音量圖標進行靜音/取消靜音
                        </p>
                    </TipsBox>
                </ControlsWrapper>
            </PlayerContainer>
        </Container>
    );
};

export default LocalVideoGuide;




const Container = styled.div`
    padding: 20px;
`;

const GuideSection = styled.div`
    margin-bottom: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    border: 2px solid #dee2e6;
`;

const GuideTitle = styled.h4`
    margin: 0 0 16px 0;
    color: #495057;
`;

const GuideStep = styled.p`
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #6c757d;

    &:last-child {
        margin: 0;
        font-size: 12px;
        color: #868e96;
    }

    code {
        background: #e9ecef;
        padding: 2px 6px;
        border-radius: 4px;
    }
`;

const TipBox = styled.div`
    padding: 12px;
    background: #fff3cd;
    border-radius: 6px;
    border: 1px solid #ffeaa7;
    margin-bottom: 8px;

    p {
        margin: 0;
        font-size: 12px;
        color: #856404;
    }
`;

const ExampleBox = styled.div`
    padding: 12px;
    background: #d1ecf1;
    border-radius: 6px;
    border: 1px solid #bee5eb;

    p {
        margin: 0 0 6px 0;
        font-size: 12px;
        color: #0c5460;
        font-weight: 500;

        &:last-child {
            margin: 0;
        }
    }

    code {
        display: block;
        background: #e9ecef;
        padding: 8px;
        border-radius: 4px;
        font-size: 11px;
        color: #495057;
    }
`;

const PlayerContainer = styled.div`
    display: flex;
    gap: 20px;
    align-items: flex-start;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const VideoWrapper = styled.div`
    flex: 1;
    background: #000;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    aspect-ratio: 16/9;
    max-height: 500px;
`;

const Video = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const VideoStatusBadge = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    z-index: 10;
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
    background: rgba(0, 0, 0, 0.9);
    padding: 24px;
    border-radius: 12px;
    max-width: 300px;

    .error-icon {
        margin-bottom: 12px;
    }

    .error-title {
        margin-bottom: 8px;
    }

    .error-message {
        font-size: 12px;
        color: #ffcccc;
        line-height: 1.4;
    }
`;

const ControlsWrapper = styled.div`
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

const ControlsTitle = styled.h3`
    margin: 0 0 16px 0;
    font-size: 18px;
    color: #333;
    text-align: center;
`;

const TipsBox = styled.div`
    margin-top: 16px;
    padding: 12px;
    background: #f0f8ff;
    border-radius: 8px;
    font-size: 14px;
    color: #666;
    text-align: center;
    border: 1px solid #e1ecf4;

    p {
        margin: 0 0 8px 0;
        font-weight: 500;

        &:last-child {
            margin: 0;
            font-size: 12px;
        }
    }
`;

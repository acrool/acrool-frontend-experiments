# StreamVolumeControl 串流音量控制元件

## 概述

`StreamVolumeControl` 是一個用於控制串流直播音量的 React 元件。它提供了直觀的音量滑動條、靜音按鈕以及音量百分比顯示功能。

## 特色功能

- 🎵 **音量滑動條**: 平滑的音量調節體驗
- 🔇 **靜音切換**: 一鍵靜音/取消靜音
- 📊 **音量顯示**: 即時顯示當前音量百分比
- 🎨 **現代化設計**: 漸層背景和圓滑的 UI 設計
- 🖱️ **互動反饋**: 滑鼠懸停效果和平滑過渡動畫

## 使用方法

### 基本使用

```tsx
import StreamVolumeControl from './StreamVolumeControl';

function App() {
  return (
    <StreamVolumeControl
      initialVolume={50}
      showPercentage={true}
      onVolumeChange={(volume, isMuted) => {
        console.log('音量變化:', { volume, isMuted });
      }}
    />
  );
}
```

### 與 YouTube Player API 集成

```tsx
function YouTubeLiveStreamPlayer() {
  const [player, setPlayer] = useState<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    // 載入 YouTube API
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      const ytPlayer = new window.YT.Player('youtube-player', {
        videoId: 'YOUR_VIDEO_ID',
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
            setIsPlayerReady(true);
          },
        },
      });
    };
  }, []);

  const handleVolumeChange = (volume: number, isMuted: boolean) => {
    if (!player || !isPlayerReady) return;
    
    if (isMuted) {
      player.mute();
    } else {
      player.unMute();
      player.setVolume(volume);
    }
  };

  return (
    <div>
      <div id="youtube-player"></div>
      <StreamVolumeControl
        initialVolume={75}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
}
```

### 與 HTML5 Video 標籤集成

```tsx
function VideoStreamPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const handleVolumeChange = (volume: number, isMuted: boolean) => {
    if (!videoRef.current || !isPlayerReady) return;
    
    if (isMuted) {
      videoRef.current.muted = true;
    } else {
      videoRef.current.muted = false;
      videoRef.current.volume = volume / 100; // video.volume 範圍是 0-1
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        width="100%"
        height="400"
        controls
        onLoadedData={() => setIsPlayerReady(true)}
      >
        <source src="/path/to/your/video.mp4" type="video/mp4" />
        <source src="/path/to/your/video.webm" type="video/webm" />
        您的瀏覽器不支援 video 標籤。
      </video>
      
      <StreamVolumeControl
        initialVolume={75}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
}
```

## Props

| 屬性名 | 類型 | 預設值 | 說明 |
|--------|------|--------|------|
| `initialVolume` | `number` | `50` | 初始音量 (0-100) |
| `onVolumeChange` | `(volume: number, isMuted: boolean) => void` | - | 音量變化回調函數 |
| `showPercentage` | `boolean` | `true` | 是否顯示音量百分比 |
| `className` | `string` | `''` | 自定義 CSS 類名 |

## 互動說明

- **音量調節**: 拖動滑動條或點擊滑動條上的任意位置
- **靜音切換**: 點擊音量圖標 (🔊/🔉/🔈/🔇)
- **視覺反饋**: 
  - 音量 0-29%: 🔈 (低音量)
  - 音量 30-69%: 🔉 (中音量)  
  - 音量 70-100%: 🔊 (高音量)
  - 靜音狀態: 🔇 (靜音)

## 注意事項

1. **真實音量控制**: 在 Storybook 示例中，此元件使用 YouTube Player API 和 HTML5 Video 實現真實的音量控制功能
2. **API 載入**: YouTube 元件會自動載入 YouTube IFrame Player API，首次使用可能需要等待 API 載入完成
3. **網路連接**: 需要穩定的網路連接來載入 YouTube API 和線上影片內容
4. **影片源穩定性**: 線上範例影片可能因網路問題載入失敗，建議使用本地 MP4 文件進行測試
5. **瀏覽器相容性**: 支援現代瀏覽器，需要 JavaScript 啟用
6. **錯誤處理**: 已加入影片載入失敗的錯誤處理和提示訊息
7. **本地文件使用**: 將 MP4 文件放在 `public/` 資料夾中，使用 `src="/your-video.mp4"` 引用

## Storybook 範例

在 Storybook 中提供了多個使用範例：

- `Primary`: 基本音量控制元件展示
- `YouTubeStream`: YouTube 影片音量控制 (使用 YouTube Player API)
- `VideoStream`: HTML5 Video 音量控制 (使用 video 標籤)
- `LocalVideoGuide`: 本地 MP4 文件使用指南

## 技術細節

- 使用 React Hooks (useState, useCallback, useRef) 進行狀態管理
- 支援雙模式：YouTube Player API 和 HTML5 Video 標籤
- CSS-in-JS 樣式定義，支持響應式設計
- TypeScript 完整類型定義支持
- 動態載入 YouTube API，按需使用
- 無外部依賴，純 React 實現

### 音量控制實現

**YouTube Player API:**
```typescript
// 設置音量 (0-100)
player.setVolume(volume);

// 靜音控制
if (isMuted) {
    player.mute();
} else {
    player.unMute();
}
```

**HTML5 Video 標籤:**
```typescript
// 設置音量 (0-1)
videoRef.current.volume = volume / 100;

// 靜音控制
videoRef.current.muted = isMuted;
```

### Storybook 實作架構

每個 story 都有獨立的實作邏輯：

- **Primary**: 純元件展示，無媒體播放器
- **YouTubeStream**: 完整的 YouTube Player API 集成
- **VideoStream**: 完整的 HTML5 Video 集成
- **LocalVideoGuide**: 本地文件使用範例與說明 
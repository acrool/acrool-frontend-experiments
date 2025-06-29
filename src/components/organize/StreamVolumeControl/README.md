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
function LiveStreamPlayer() {
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

1. **真實音量控制**: 在 Storybook 示例中，此元件使用 YouTube Player API 實現真實的音量控制功能
2. **API 載入**: 元件會自動載入 YouTube IFrame Player API，首次使用可能需要等待 API 載入完成
3. **網路連接**: 需要穩定的網路連接來載入 YouTube API 和影片內容
4. **瀏覽器相容性**: 支援現代瀏覽器，需要 JavaScript 啟用
5. **實際整合**: 在生產環境中使用時，建議預先載入 YouTube API 以提升使用者體驗

## Storybook 範例

在 Storybook 中提供了多個使用範例：

- `Primary`: 基本音量控制
- `WithLaoPiStream`: 老皮直播模擬
- `WithLuDanStream`: 滷蛋直播模擬  
- `WithDingTeStream`: 丁特直播模擬
- `MultipleStreams`: 多重直播同時控制

## 技術細節

- 使用 React Hooks (useState, useCallback) 進行狀態管理
- CSS-in-JS 樣式定義，支持響應式設計
- TypeScript 完整類型定義支持
- 無外部依賴，純 React 實現 
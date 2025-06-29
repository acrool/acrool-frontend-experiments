import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useRef, useEffect, useState } from 'react';

import StreamVolumeControl from './StreamVolumeControl';
import { YouTubePlayer } from './index';
import LocalVideoGuideComponent from './LocalVideoGuide';

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
    render: (args) => (
        <YouTubePlayer
            videoId="dQw4w9WgXcQ" // 經典範例影片
            initialVolume={args.initialVolume || 60}
            showPercentage={args.showPercentage}
        />
    ),
    args: {
        initialVolume: 60,
        showPercentage: true,
    },
};



// 本地 MP4 文件使用指南
export const LocalVideoGuide: Story = {
    render: (args) => (
        <LocalVideoGuideComponent
            videoSources={[
                "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
                "https://file-examples.com/storage/fe86f21216c66346d629b/2017/10/file_example_MP4_480_1_5MG.mp4",
                "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
            ]}
            initialVolume={args.initialVolume || 60}
            showPercentage={args.showPercentage}
            showGuide={true}
        />
    ),
    args: {
        initialVolume: 60,
        showPercentage: true,
    },
};

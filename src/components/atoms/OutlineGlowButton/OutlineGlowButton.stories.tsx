import type {Meta, StoryObj} from '@storybook/react-vite';
import React from 'react';
import OutlineGlowButton from "./OutlineGlowButton";


const meta = {
    title: 'Atoms/OutlineGlowButton.stories',
    component: OutlineGlowButton,
    argTypes: {},
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `帶圍繞光芒的按鈕`
            },
        },
    },
    tags: ['autodocs'],
    args: {
        children: 'OutlineGlowButton',
    },

} satisfies Meta<typeof OutlineGlowButton>;

export default meta;
type Story = StoryObj<typeof meta>;



export const Primary: Story = {
    args: {},
};

import type {Meta, StoryObj} from '@storybook/react-vite';

import React from 'react';
import Banner from './Banner';

const meta = {
    title: 'Banner',
    component: Banner,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Img animation use transform'
            },
        },
    },
    // tags: ['autodocs'],
    argTypes: {},
    args: {
        name: 'Acrool Frontend Experiments',
        repositoryUrl: 'https://github.com/acrool/acrool-frontend-experiments',
    },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;



export const Primary: Story = {
    args: {},
};

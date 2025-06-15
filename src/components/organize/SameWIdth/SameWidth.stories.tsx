import type {Meta, StoryObj} from '@storybook/react';

import SameWidth from './SameWidth';

const meta = {
    title: 'Organize/SameWidth',
    component: SameWidth,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '寬度100% 依賴鄰居撐開的寬度，關鍵為外層 justify-self-start'
            },
        },
    },
    tags: ['autodocs'],
    args: {},
} satisfies Meta<typeof SameWidth>;

export default meta;
type Story = StoryObj<typeof meta>;



export const Primary: Story = {
    args: {},
};

import type {Meta, StoryObj} from '@storybook/react-vite';

import SameHeight from './SameHeight';

const meta = {
    title: 'Organize/SameHeight',
    component: SameHeight,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '依賴鄰居撐開的高度，關鍵為外層 align-items-stretch (此為預設值)，需要跟著高度走得不可設定高度'
            },
        },
    },
    tags: ['autodocs'],
    args: {},
} satisfies Meta<typeof SameHeight>;

export default meta;
type Story = StoryObj<typeof meta>;



export const Primary: Story = {
    args: {},
};

import type {Meta, StoryObj} from '@storybook/react-vite';

import ResetForm from './ResetForm';

const meta = {
    title: 'Organize/ResetForm',
    component: ResetForm,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '透過 HookForm Reset 預設值'
            },
        },
    },
    tags: ['autodocs'],
    args: {},
} satisfies Meta<typeof ResetForm>;

export default meta;
type Story = StoryObj<typeof meta>;



export const Primary: Story = {
    args: {},
};

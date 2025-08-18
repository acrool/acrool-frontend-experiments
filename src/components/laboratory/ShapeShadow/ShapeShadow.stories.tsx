import {Flex} from '@acrool/react-grid';
import type {Meta, StoryObj} from '@storybook/react-vite';
import React from 'react';
import styled from "styled-components";


const meta = {
    title: 'Laboratory/ShapeShadow',
    argTypes: {},
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `測試不規則形狀圖片的陰影，Webp、SVG、PNG可支援\n
https://webcode.tools/css-generator/drop-shadow`
            },
        },
    },
    tags: ['autodocs'],
    args: {},

} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;



export const ImageWithFilterDropShadow: Story = {
    args: {},
    render: function Render(args) {
        return <img src="/static/acrool_logo.svg"
            width={200}
            height={200}
            alt="acrool logo"
            style={{
                filter: 'drop-shadow(-13px 5px 10px #000000)'
            }}/>;
    }
};

export const ImageWithBoxShadow: Story = {
    args: {},
    render: function Render(args) {
        return <img src="/static/acrool_logo.svg"
            width={200}
            height={200}
            alt="acrool logo"
            style={{
                boxShadow: '0 0 10px 10px #000000',
            }}/>;
    }
};


export const TextWithBoxShadow: Story = {
    args: {},
    render: function Render(args) {
        return <Flex column className="gap-4">
            <p
                style={{
                    fontSize: '20px',
                    filter: 'drop-shadow(-13px 5px 10px red)'
                }}>
                Test Text with Box Shadow
            </p>
            <p
                style={{
                    fontSize: '20px',
                    filter: 'drop-shadow(1px 0 0 red) drop-shadow(-1px 0 0 red) drop-shadow(0 1px 0 red) drop-shadow(0 -1px 0 red)'
                }}>
                Test Text with Box Shadow
            </p>

            <svg xmlns="http://www.w3.org/2000/svg" width="800" height="200">
                <CustomText
                    className="text stroke"
                    alignmentBaseline="text-before-edge"
                    textAnchor="start"
                >
                    這是一段很長的文字，會自動換行， 因為這其實是 HTML 的。
                </CustomText>
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" width="800" height="200">
                <foreignObject width="100%" height="100%">
                            這是一段很長的文字，會自動換行，
                            因為這其實是 HTML 的。
                </foreignObject>
            </svg>
        </Flex>;
    }
}




const CustomText = styled.text`
    font-size: 50px;
    color: red;
    fill: #fff;
    font-weight: 400;

    stroke: #000;
    stroke-width: 4px;
    paint-order: stroke;
`;


import {media} from '@acrool/react-grid';
import {FCChildrenProps} from '@acrool/react-types';
import styled, {keyframes} from 'styled-components';

import BaseButton from '../BaseButton';


interface IPromotionButtonProps {

}



/**
 * 優惠活動按鈕
 * 帶光暈效果
 * 滑鼠時會顯示視頻覆蓋
 */
const PromotionButton = ({
     className,
     style,
     children,
 }: IPromotionButtonProps & FCChildrenProps) => {


    return <PromotionButtonRoot
        className={className}
        style={style}
    >
        <Text>
            {children}
        </Text>

    </PromotionButtonRoot>;
};

export default PromotionButton;



const Text = styled.div`
    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    z-index: 15;
    border-radius: 14px;
    background: linear-gradient(90deg, rgba(255, 175, 175, 0.50) 0%, rgba(42, 213, 250, 0.50) 49.5%, rgba(137, 81, 255, 0.50) 100%);
    background-color: rgba(0,0,0,0);
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.30) inset, 0px 20px 80px 0px rgba(153, 51, 255, 0.50);

    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;

    transition: background-color .5s;

     ${media.lg`
        background-color: #000;
     `}

`;




const lineLightAnimation = keyframes`
    from{
        transform: translate(-50%, -50%) rotate(0deg);
    }
    to{
        transform: translate(-50%, -50%) rotate(360deg);
    }
`;


const PromotionButtonRoot = styled(BaseButton)`
    display: flex;
    width: 264px;
    height: 56px;
    padding: 1px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 14px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transform: translateY(0);
    transform-origin: center center;



    transition: transform .6s, box-shadow .3s;

    &:before {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 0;
        background: linear-gradient(90deg, rgba(255, 175, 175, .5) 0%, rgba(42, 213, 250, .5) 49.5%, rgba(137, 81, 255, .5) 100%);
    }

    &:after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: auto;
        aspect-ratio: 1;

        animation: 3s linear 0s infinite normal none running ${lineLightAnimation};
        background: conic-gradient(transparent 90deg, rgb(2, 156, 253) 150deg, rgb(55, 213, 211) 210deg, transparent 270deg);
        left: 50%;
        top: 50%;
        z-index: 1;
        transform: translate(-50%, -50%) rotate(45deg);
        transform-origin: center center;


        opacity: 1;
        will-change: auto;
    }


    ${media.lg`
        &:hover {

            box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.30) inset, 0px 20px 80px 0px rgba(153, 51, 255, 0.50);
            transform: translateY(-10px);
        }
    `}

`;


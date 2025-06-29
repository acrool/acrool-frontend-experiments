import {FCChildrenProps} from '@acrool/react-types';
import styled, {keyframes} from 'styled-components';



interface IProps extends FCChildrenProps{
    type?: 'submit'|'button'
    onClick?: () => void
}


/**
 * 按鈕
 * @param className
 * @param children
 * @param themeColor 主題顏色
 * @param isBlock 是否佔滿
 * @param size 大小
 * @param type
 * @param radius 圓角
 * @param onClick
 */

const OutlineGlowButton = ({
    className,
    children,
    type = 'button',
    onClick,
}: IProps) => {

    const labelProps = {children, type};


    return <TestButtonRoot className={className}
        {...labelProps}
        onClick={onClick}
    >
        <Children>
            {children}
        </Children>
    </TestButtonRoot>;
};

export default OutlineGlowButton;




const lineLightAnimation = keyframes`
    from{
        transform: rotate(0deg);
        //transform: rotate(0deg) translate(-50%, -50%);
    }
    to{
        transform: rotate(360deg);
        //transform: rotate(360deg) translate(-50%, -50%);
    }
`;


const Children = styled.div`
    position: relative;
    z-index: 1;
    border-radius: 4px;
    background-color: rgb(27, 28, 29);
    color: #fff;
    padding: 10px 20px;
`;


const TestButtonRoot = styled.button`

    position: relative;
    line-height: 20px;
    //width: 100%;
    padding: 1px;
    overflow: hidden;
    background: var(--sb-sidebar-bottom-card-background, #1B1C1D);
    border-radius: var(--sb-sidebar-bottom-card-border-radius, 5px);
    box-shadow: rgb(0 0 0 / 33%) -4px 2px 9px 1px;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.15s;


    &:disabled {
        opacity: 0.6;
    }


    &:after {
        content: "";
        display: block;
        position: absolute;
        left: -25%;
        top: -200%;
        width: 150%;
        height: auto;
        aspect-ratio: 1;

        animation: 3s linear 0s infinite normal none running ${lineLightAnimation};
        background: conic-gradient(transparent 90deg, rgb(2, 156, 253) 150deg, rgb(55, 213, 211) 210deg, transparent 270deg);
        opacity: 1;
        will-change: auto;
    }


`;



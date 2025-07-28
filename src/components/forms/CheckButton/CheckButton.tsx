import {media} from '@acrool/react-grid';
import {FCChildrenProps} from '@acrool/react-types';
import styled, {css} from 'styled-components';

import {ICheckButtonProps} from './types';

/**
 * CheckButton
 */
const CheckButton = ({
    className,
    style,
    children,
    onChange,
    value,
    ref,
    name,
    disabled = false,
    checked = false,
    isError,
}: ICheckButtonProps & FCChildrenProps) => {

    /**
     * 處理 checkbox 變更事件
     */
    const handleOnChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled || !onChange) return;
        onChange(ev.target.value);
    };

    return <CheckButtonRoot
        className={className}
        style={style}
        $disabled={disabled}
        $isError={isError}
    >
        <Checkbox
            type="checkbox"
            ref={ref}
            name={name}
            value={value}
            onChange={handleOnChange}
            checked={checked}
            disabled={disabled}
        />

        <BaseWrapper className="invisible">
            {children}
        </BaseWrapper>

        <Overlay>
            <StaticWrapper>
                {children}
            </StaticWrapper>
            <StaticWrapper>
                {children}
            </StaticWrapper>
        </Overlay>

        {/*<Checked>*/}
        {/*    <StaticWrapper>*/}
        {/*        {children}*/}
        {/*    </StaticWrapper>*/}
        {/*    <StaticWrapper>*/}
        {/*        {children}*/}
        {/*    </StaticWrapper>*/}
        {/*</Checked>*/}
    </CheckButtonRoot>;
};

export default CheckButton;



const BaseWrapper = styled.div`
    white-space:nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
`;


const StaticWrapper = styled(BaseWrapper)`
    min-height: 100%;
    height: 100%;
    width: 100%;
`;


const Overlay = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    transition: transform 0.4s;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`;



const Checkbox = styled.input`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    opacity: 0;
    cursor: pointer;

    &:checked ~ ${Overlay} ${StaticWrapper}{
        background-color: #000;
        color: #fff;
    }

    &:disabled {
        cursor: not-allowed;
    }
`;


export const CheckButtonRoot = styled.div<{$disabled: boolean, $isError?: boolean}>`

    display: flex;
    gap: 8px;
    border-radius: 70px;
    border: 1px solid #E7E7E7;
    background: #fff;
    opacity: ${props => props.$disabled ? 0.6 : 1};
    pointer-events: ${props => props.$disabled ? 'none' : 'auto'};
    transition: transform 0.4s;

    position: relative;
    padding: 20px 30px;

    overflow-y: hidden;

     ${media.lg`
        &:hover{
            border-color: #000;
            ${Overlay}{
                transform: translateY(-100%);
            }
            transform: scaleX(.93);
        }
     `}


    ${props => props.$isError && css`
        border-color: #FFCDCD;
    `}
`;

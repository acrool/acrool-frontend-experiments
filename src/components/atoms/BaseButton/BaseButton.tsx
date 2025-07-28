import {FCChildrenProps} from '@acrool/react-types';
import {RefCallback, RefObject} from 'react';
import styled from 'styled-components';


interface IProps extends FCChildrenProps {
    disabled?: boolean
    type?: 'button'|'submit'|'reset'
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    onFocus?: () => void
    onPointerDown?: (e: React.MouseEvent<HTMLButtonElement>) => void
    spring?: boolean
    ref?: RefObject<HTMLButtonElement|null> | RefCallback<HTMLButtonElement|null>
}


/**
 * 基礎的 Button, Non Padding
 * @param className
 * @param type
 * @param onClick
 * @param onPointerDown
 * @param onFocus
 * @param children
 * @param disabled
 * @param spring
 * @param ref
 */
const BaseButton = ({
    className,
    type = 'button',
    onClick,
    onPointerDown,
    onFocus,
    children,
    disabled = false,
    spring = false,
    ref,
}: IProps) => {

    return <BaseButtonRoot
        ref={ref}
        className={className}
        type={type}
        onClick={onClick}
        onFocus={onFocus}
        onPointerDown={onPointerDown}
        disabled={disabled}
    >
        {children}
    </BaseButtonRoot>;
};

export default BaseButton;





const BaseButtonRoot = styled.div`
    padding: 0;
    display: block;
    color: inherit;
    user-select: none;
`;

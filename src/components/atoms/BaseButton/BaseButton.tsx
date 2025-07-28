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
 * @param children
 * @param disabled
 * @param ref
 */
const BaseButton = ({
    className,
    type = 'button',
    onClick,
    children,
    disabled = false,
    ref,
}: IProps) => {

    return <BaseButtonRoot
        ref={ref}
        className={className}
        type={type}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </BaseButtonRoot>;
};

export default BaseButton;





const BaseButtonRoot = styled.button`
    padding: 0;
    display: block;
    color: inherit;
    user-select: none;
`;

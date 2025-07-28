import styled from 'styled-components';

import CheckButton from '../CheckButton/CheckButton';
import {ICheckButtonGroupProps, ICheckButtonOption} from './types';

/**
 * CheckboxGroup - 可多選的 checkbox 群組元件
 */
const CheckButtonSingleGroup = ({
    options,
    value,
    onChange,
    className,
    name,
    style,
    disabled = false,
    isError
}: ICheckButtonGroupProps<string>) => {


    /**
     * 處理單個 checkbox 變更事件
     */
    const handleOptionChange = (optionValue: string) => {
        if (disabled) return;

        if (onChange) {
            onChange(optionValue);
        }
    };


    return (
        <CheckboxGroupRoot
            className={className}
            style={style}
            $disabled={disabled}
        >
            {options.map((option: ICheckButtonOption) => (
                <CheckboxItem key={option.value}>
                    <CheckButton
                        name={name}
                        value={option.value}
                        onChange={handleOptionChange}
                        disabled={disabled || option.disabled}
                        checked={value === option.value}
                        isError={isError}
                    >
                        {option.label}
                    </CheckButton>
                </CheckboxItem>
            ))}
        </CheckboxGroupRoot>
    );
};

export default CheckButtonSingleGroup;





const CheckboxGroupRoot = styled.div<{$disabled: boolean}>`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    opacity: ${props => props.$disabled ? 0.6 : 1};
    pointer-events: ${props => props.$disabled ? 'none' : 'auto'};
`;

const CheckboxItem = styled.div`
    flex-shrink: 0;
`;

import {useEffect,useState} from 'react';
import styled from 'styled-components';

import CheckButton from '../CheckButton/CheckButton';
import {ICheckButtonGroupProps, ICheckButtonOption} from './types';

/**
 * CheckboxGroup - 可多選的 checkbox 群組元件
 */
const CheckButtonGroup = ({
    options,
    value = [],
    onChange,
    className,
    name,
    style,
    disabled = false,
    isError,
}: ICheckButtonGroupProps<string[]>) => {

    const [selectedValues, setSelectedValues] = useState<string[]>(value);

    // 當外部 value 改變時，更新內部狀態
    useEffect(() => {
        setSelectedValues(value);
    }, [value]);

    /**
     * 處理單個 checkbox 變更事件
     */
    const handleOptionChange = (optionValue: string) => {
        if (disabled) return;

        const newSelectedValues = selectedValues.includes(optionValue)
            ? selectedValues.filter(v => v !== optionValue)
            : [...selectedValues, optionValue];

        setSelectedValues(newSelectedValues);

        if (onChange) {
            onChange(newSelectedValues);
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
                        checked={value?.includes(option.value)}
                        isError={isError}
                    >
                        {option.label}
                    </CheckButton>
                </CheckboxItem>
            ))}
        </CheckboxGroupRoot>
    );
};

export default CheckButtonGroup;





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

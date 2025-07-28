import {TSetState} from '@acrool/react-types';
import {ReactNode,RefCallback} from 'react';

export interface ICheckButtonProps {
    ref?: RefCallback<HTMLInputElement>
    value?: string
    name: string
    onChange: TSetState<string>
    checked?: boolean
    disabled?: boolean
    isError?: boolean
}


export interface ICheckButtonOption {
    value: string
    label: ReactNode
    disabled?: boolean
}

export interface ICheckButtonGroupProps<T = string> {
    ref?: RefCallback<HTMLInputElement>
    options: ICheckButtonOption[]
    value?: T
    onChange?: TSetState<T>
    className?: string
    style?: React.CSSProperties
    disabled?: boolean
    name: string
    isError?: boolean
}

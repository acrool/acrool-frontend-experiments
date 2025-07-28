import {FCProps} from '@acrool/react-types';

import {TextFieldRoot} from './styles';
import {ITextFieldProps} from './types';

/**
 * TextField
 */
const TextField = ({
    className,
    style,
    ref,
    value,
    name,
    onChange,
    placeholder
}: ITextFieldProps & FCProps) => {
    return <TextFieldRoot
        className={className}
        style={style}
        ref={ref}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
    />;
};

export default TextField;

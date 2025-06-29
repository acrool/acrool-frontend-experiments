import {FCProps} from '@acrool/react-types';

import {TextareaRoot} from './styles';
import {ITextareaProps} from './types';

/**
 * Textarea
 */
const Textarea = ({
    className,
    style,
    ref,
    name,
    value,
    onChange,
    placeholder
}: ITextareaProps & FCProps) => {
    return <TextareaRoot
        className={className}
        style={style}
        ref={ref}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
    />;
};

export default Textarea;

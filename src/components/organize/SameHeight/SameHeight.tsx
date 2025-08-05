import {Flex} from '@acrool/react-grid';

import Textarea from '@/components/forms/Textarea';
import TextField from '@/components/forms/TextField';


const SameHeight = () => {

    return <Flex className="align-items-stretch">
        <div style={{backgroundColor: '#ccc',  width: '100px'}}>
            <p>Left</p>
            <p>不可設定高度</p>
        </div>

        <div style={{backgroundColor: 'red', height: '200px', width: '100px'}}>
            <p>Right</p>
            <p>200px</p>
        </div>
    </Flex>;
};

export default SameHeight;



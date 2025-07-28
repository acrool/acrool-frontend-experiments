import {Flex} from '@acrool/react-grid';

import Textarea from '@/components/forms/Textarea';
import TextField from '@/components/forms/TextField';


const SameWidth = () => {
    const data = [
        {name: 'name', text: '姓名或稱呼'},
        {name: 'email', text: 'Email'},
        {name: 'tel', text: '電話'},
    ];

    return <Flex column className="justify-self-start">
        <Flex className="gap-4 mb-4">
            {data.map(row => {
                return <TextField
                    placeholder={row.text}
                />;
            })}
        </Flex>

        <Flex>
            <Textarea
                placeholder="有個創新的念頭？一起來交流看看！"
                className="w-100"
            />

        </Flex>
    </Flex>;
};

export default SameWidth;



import {Flex} from "@acrool/react-grid";
import TextField from "@/components/forms/TextField";
import Textarea from "@/components/forms/Textarea";
import {Controller, useForm} from "react-hook-form";
import {useEffect} from "react";

interface IForm{
    name: string
    email: string
    tel: string
}

const ResetForm = () => {

    const HookForm = useForm({
        defaultValues: {
            name: 'Imagine',
            email: '',
            tel: '',
        }
    });


    useEffect(() => {
        setTimeout(() => {
            HookForm.reset({
                email: 'imagine@gmail.com'
            })
        }, 1000);


        setTimeout(() => {
            HookForm.resetField('tel', {
                defaultValue: '0977-123123'
            });
        }, 1500)
    }, []);

    return <Flex column className="justify-self-start">
        <Flex className="mb-4">
            <Controller
                control={HookForm.control}
                name="name"
                defaultValue=""
                render={({field}) => {
                    return <TextField
                        placeholder="Name"
                        {...field}
                    />;
                }}
            />
        </Flex>
        <Flex className="mb-4">
            <Controller
                control={HookForm.control}
                name="email"
                defaultValue=""
                render={({field}) => {
                    return <TextField
                        placeholder="Email"
                        {...field}
                    />;
                }}
            />
        </Flex>
        <Flex className="mb-4">
            <Controller
                control={HookForm.control}
                name="tel"
                defaultValue=""
                render={({field}) => {
                    return <TextField
                        placeholder="Tel"
                        {...field}
                    />;
                }}
            />
        </Flex>

        <Flex>
            <Textarea
                placeholder="Comment"
                className="w-100"
            />

        </Flex>
    </Flex>;
};

export default ResetForm;



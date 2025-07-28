import {isNotEmpty} from '@acrool/js-utils/equal';
import {Flex} from '@acrool/react-grid';
import {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import styled from 'styled-components';

import Button from '@/components/atoms/Button';
import {CheckButtonGroup} from '@/components/forms/CheckButton';
import Textarea from '@/components/forms/Textarea';
import TextField from '@/components/forms/TextField';
import {needService} from '@/components/organize/ResetForm/data';
import {useNameAPI, useServiceAPI} from '@/components/organize/ResetForm/useAPI';

interface IForm {
    name: string
    email: string
    tel: string
    services: string[]
    comment: string
}


const ResetForm = () => {

    const {services, success: servicesSuccess} = useServiceAPI();
    const {name, success: nameSuccess} = useNameAPI();

    const HookForm = useForm<IForm>({
        defaultValues: {
            name: 'Imagine',
            email: '',
            tel: '',
            comment: '',
            services: [],
        }
    });


    useEffect(() => {
        if(servicesSuccess){
            HookForm.resetField('services', {
                defaultValue: services?.map(val => val) || [],
            });
        }
    }, [services, servicesSuccess]);


    useEffect(() => {
        setTimeout(() => {
            HookForm.reset({
                email: 'imagine@gmail.com'
            });
        }, 1000);


        setTimeout(() => {
            HookForm.resetField('tel', {
                defaultValue: '0977-123123'
            });
        }, 1500);

    }, []);


    useEffect(() => {
        HookForm.reset({
            name,
        });
    }, [name, nameSuccess]);


    /**
     * Form Submit
     *
     * @param formData
     */
    const handleOnSubmit = (formData: IForm) => {
        console.log('formData', formData);
    };


    return <form
        onSubmit={HookForm.handleSubmit(handleOnSubmit)}
        onReset={() => HookForm.reset()}
    >
        <Flex column>

            <FormGroup>
                <SubTitle>名稱</SubTitle>
                <Flex className="flex-wrap">
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
            </FormGroup>


            <FormGroup>
                <SubTitle>
                    Email
                </SubTitle>

                <Flex className="gap-4 flex-wrap">
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
            </FormGroup>


            <FormGroup>
                <SubTitle>
                    電話
                </SubTitle>

                <Flex className="gap-4 flex-wrap">
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
            </FormGroup>


            <FormGroup>
                <SubTitle>
                    需要什麼樣的服務？
                </SubTitle>

                <Flex className="gap-4 flex-wrap">
                    <Controller
                        control={HookForm.control}
                        name="services"
                        defaultValue={[]}
                        rules={{required: true}}
                        render={({field, fieldState}) => {
                            return <CheckButtonGroup
                                options={needService}
                                isError={isNotEmpty(fieldState.error)}
                                {...field}
                            />;
                        }}
                    />
                </Flex>
            </FormGroup>


            <FormGroup>
                <SubTitle>
                    需要什麼樣的服務？
                </SubTitle>

                <Flex className="gap-4 flex-wrap">
                    <Controller
                        control={HookForm.control}
                        name="comment"
                        defaultValue=""
                        rules={{required: true}}
                        render={({field, fieldState}) => {
                            return <Textarea
                                {...field}
                                placeholder="Comment"
                                className="w-100"
                            />;
                        }}
                    />
                </Flex>
            </FormGroup>

            <FormGroup className="gap-3 d-flex">
                <SubmitButton type="submit">
                    送出
                </SubmitButton>
                <ResetButton type="reset">
                    重設
                </ResetButton>
            </FormGroup>

        </Flex>
    </form>;
};

export default ResetForm;


const FormGroup = styled.div`
    margin-bottom: 15px;
`;


const SubTitle = styled.div`
    margin-bottom: 10px;
`;


const ResetButton = styled(Button)`
    background: #ff8383;
    color: #fff;
    border-radius: 99em;
`;


const SubmitButton = styled(Button)`
    opacity: 0.5;
    background: #000;
    color: #fff;
    border-radius: 99em;
`;




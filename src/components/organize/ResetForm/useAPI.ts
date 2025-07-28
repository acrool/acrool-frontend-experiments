import {useEffect, useState} from 'react';

export const useNameAPI = () => {

    const [name, setName] = useState<string|undefined>();
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            setName('Imagine');
            setSuccess(true);
        }, 700);
    }, []);


    return {
        success,
        name,
    };
};

export const useServiceAPI = () => {

    const [services, setServices] = useState<string[]|undefined>();
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            setServices(['1', '3', '4']);
            setSuccess(true);
        }, 1000);
    }, []);

    return {
        success,
        services,
    };
};

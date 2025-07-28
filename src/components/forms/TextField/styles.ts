import styled from 'styled-components';

export const TextFieldRoot = styled.input`
    display: flex;
    height: 66px;
    padding: 20px 30px;
    align-items: center;
    gap: 8px;

    border-radius: 70px;
    border: 1px solid #E7E7E7;
    background: #FFF;

    &::-webkit-input-placeholder, &:read-only, &:disabled {
        color: #cdcdcd;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0px 1000px #2b3035 inset;
        transition: background-color 5000s ease-in-out 0s;
        -webkit-text-fill-color: #c8cfd6;
    }

`;

import styled from 'styled-components';

export const TextareaRoot = styled.textarea`
    display: flex;
    height: 200px;
    padding: 20px 30px;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;

    border-radius: 30px;
    border: 1px solid #E7E7E7;
    background: #FFF;
    resize: none;

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

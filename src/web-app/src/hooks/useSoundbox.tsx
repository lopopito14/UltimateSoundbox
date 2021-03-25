import React from 'react';
import { ISoundbox } from '../interfaces';
import { useContext } from './useContext';

const useSoundbox = () => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const { context } = useContext();

    const { soundbox } = context.state;

    React.useEffect(() => {
        const fetchDatas = async () => {
            const response = await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/soundbox`);
            const soundbox = await response.json() as ISoundbox;

            context.dispatch({ type: 'loadSoundbox', soundbox: soundbox });
        };

        if (!context.state.soundbox) {
            fetchDatas();
        }
    }, [REACT_APP_AZURE_FUNCTIONS_API, context]);

    return { soundbox }
}

export default useSoundbox;
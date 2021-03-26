import React from 'react';
import { ISoundbox } from '../interfaces';
import { Types, useMainContext } from './useContext';

const useSoundbox = () => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const { state, dispatch } = useMainContext();

    const { soundbox } = state;

    React.useEffect(() => {
        const fetchDatas = async () => {
            try {
                const response = await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/soundbox`);
                const soundbox = await response.json() as ISoundbox;

                dispatch({ type: Types.LOAD_SOUNDBOX, payload: soundbox });
            } catch (e) {
                dispatch({ type: Types.PUSH_ERROR_ACTION, payload: e });
            }
        };

        if (!soundbox) {
            fetchDatas();
        }
    }, [REACT_APP_AZURE_FUNCTIONS_API, dispatch, soundbox]);

    return { soundbox };
}

export default useSoundbox;
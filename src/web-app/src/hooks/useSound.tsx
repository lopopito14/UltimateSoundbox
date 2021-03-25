import React from 'react';
import { Types, useMainContext } from './useContext';

const useSound = (bundleId: string, soundId: string, movieId: string) => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const { state, dispatch } = useMainContext();

    const { offline, teamsContext } = state;

    const onQueueSound = React.useCallback(() => {
        const uri: string = `${REACT_APP_AZURE_FUNCTIONS_API}/sound/${bundleId}/${soundId}/${movieId}`;
        if (offline) {
            dispatch({ type: Types.PUSH_INTERNAL_SOUND, payload: { soundUrl: uri } });
        } else if (teamsContext?.loginHint) {
            dispatch({ type: Types.PUSH_SENT_SOUND, payload: { soundUrl: uri, sender: teamsContext?.loginHint } });
        }
    }, [REACT_APP_AZURE_FUNCTIONS_API, bundleId, dispatch, movieId, soundId, offline, teamsContext?.loginHint]);

    return { onQueueSound }
}

export default useSound;
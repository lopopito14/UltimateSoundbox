import React from 'react';
import { useContext } from './useContext';

const useSound = (bundleId: string, soundId: string, movieId: string) => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const { context } = useContext();

    const onQueueSound = React.useCallback(() => {
        const uri: string = `${REACT_APP_AZURE_FUNCTIONS_API}/sound/${bundleId}/${soundId}/${movieId}`;
        if (context.state.local) {
            context.dispatch({ type: 'pushInternalSound', sound: uri });
        } else {
            context.dispatch({ type: 'pushSentSound', sound: uri });
        }
    }, [REACT_APP_AZURE_FUNCTIONS_API, bundleId, context, movieId, soundId]);

    return { onQueueSound }
}

export default useSound;
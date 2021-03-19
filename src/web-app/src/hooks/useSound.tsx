import React from 'react';
import { useContext } from './useContext';

const useSound = (bundleId: string, soundId: string, movieId: string) => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const { context } = useContext();

    const onQueueSound = React.useCallback(() => {
        const uri: string = `${REACT_APP_AZURE_FUNCTIONS_API}/Sound/${bundleId}/${soundId}/${movieId}`;
        context.dispatch({ type: 'pushInternalSound', sound: uri });
    }, [REACT_APP_AZURE_FUNCTIONS_API, bundleId, context, movieId, soundId]);

    return { onQueueSound }
}

export default useSound;
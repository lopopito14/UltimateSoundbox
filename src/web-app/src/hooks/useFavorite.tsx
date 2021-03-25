import React from 'react';
import { Types, useMainContext } from './useContext';

const useFavorite = (bundleId: number, soundId: number, movieId: number) => {

    const { dispatch } = useMainContext();

    const manageFavorite = React.useCallback(() => {
        dispatch({ type: Types.MANAGED_FAVORITE, payload: { bundleId, movieId, soundId } });
    }, [bundleId, dispatch, movieId, soundId]);

    return { manageFavorite }
}

export default useFavorite;
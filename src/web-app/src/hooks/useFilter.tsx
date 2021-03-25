import React from 'react';
import { Types, useMainContext } from './useContext';

const useFilter = (showAll: boolean) => {

    const { dispatch } = useMainContext();

    React.useEffect(() => {
        dispatch({ type: Types.FILTER_SOUNDBOX, payload: showAll });
    }, [dispatch, showAll]);
}

export default useFilter;
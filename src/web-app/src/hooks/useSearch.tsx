import React from 'react';
import { Types, useMainContext } from './useContext';

const useSearch = (search: string) => {

    const { dispatch } = useMainContext();

    React.useEffect(() => {
        dispatch({ type: Types.SEARCH_SOUNDBOX, payload: search });
    }, [dispatch, search]);
}

export default useSearch;
import React from 'react';
import { Types, useMainContext } from './useContext';

interface IProps {
    search: string;
}

const useSearch = (props: IProps) => {

    const { search } = props;

    const { dispatch } = useMainContext();

    React.useEffect(() => {
        dispatch({ type: Types.SEARCH_SOUNDBOX, payload: search });
    }, [dispatch, search]);
}

export default useSearch;
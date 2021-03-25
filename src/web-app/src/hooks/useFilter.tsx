import React from 'react';
import { Types, useMainContext } from './useContext';

interface IProps {
    showAll: boolean;
}

const useFilter = (props: IProps) => {

    const { showAll } = props;

    const { dispatch } = useMainContext();

    React.useEffect(() => {
        dispatch({ type: Types.FILTER_SOUNDBOX, payload: showAll });
    }, [dispatch, showAll]);
}

export default useFilter;
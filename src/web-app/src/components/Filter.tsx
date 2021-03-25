
import React from 'react';
import useFilter from '../hooks/useFilter';
import './Filter.css';

const Filter = () => {

    const [showAll, setShowAll] = React.useState<boolean>(true);

    useFilter({ showAll: showAll });

    const onChangeFilter = React.useCallback((showAll: boolean) => {
        setShowAll(showAll);
    }, []);

    return (
        <div>
            <button onClick={() => onChangeFilter(true)}>All</button>
            <button onClick={() => onChangeFilter(false)}>Favorite</button>
        </div>
    )
}

export default Filter;

import React from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import useFilter from '../hooks/useFilter';
import './Filter.css';

const Filter = () => {

    const [showAll, setShowAll] = React.useState<boolean>(true);

    useFilter(showAll);

    const onChangeFilter = React.useCallback((showAll: boolean) => {
        setShowAll(showAll);
    }, []);

    return (
        <ButtonGroup toggle={true} aria-label="Filter">
            <ToggleButton
                type="radio"
                variant="primary"
                checked={showAll}
                value="1"
                onChange={() => onChangeFilter(true)}
            >
                All
                </ToggleButton>
            <ToggleButton
                type="radio"
                variant="primary"
                checked={!showAll}
                value="1"
                onChange={() => onChangeFilter(false)}
            >
                Favorite
                </ToggleButton>
        </ButtonGroup>
    )
}

export default Filter;
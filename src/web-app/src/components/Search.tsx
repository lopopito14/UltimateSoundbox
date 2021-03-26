
import React, { FormEvent } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import useSearch from '../hooks/useSearch';
import './Search.css';

const Search = () => {

    const [search, setSearch] = React.useState<string>('');

    useSearch(search);

    const onSearch = React.useCallback((e: FormEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    }, []);

    return (
        <div className="Search-container">
            <InputGroup>
                <FormControl
                    placeholder="Search..."
                    value={search}
                    onInput={onSearch}
                />
                <InputGroup.Append>
                    <Button variant="danger" onClick={() => setSearch('')} disabled={search === ''}>Clear</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
    )
}

export default Search;
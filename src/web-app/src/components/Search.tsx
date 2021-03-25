
import React, { FormEvent } from 'react';
import useSearch from '../hooks/useSearch';
import './Search.css';

const Search = () => {

    const [search, setSearch] = React.useState<string>('');

    useSearch({ search: search });

    const onSearch = React.useCallback((e: FormEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    }, []);

    return (
        <div>
            <label htmlFor="search">Search:</label>
            <input type="text" id="search" name="search" onInput={onSearch} value={search} />
            <button onClick={() => setSearch('')}>Clear</button>
        </div>
    )
}

export default Search;
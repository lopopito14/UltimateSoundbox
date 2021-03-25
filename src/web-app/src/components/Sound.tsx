import React from 'react';
import { useMainContext } from '../hooks/useContext';
import useFavorite from '../hooks/useFavorite';
import useImage from '../hooks/useImage';
import useSound from '../hooks/useSound';
import { ISound } from '../interfaces';
import "./Sound.css";

interface IProps {
    key: string;
    bundleId: number;
    sound: ISound;
}

const Sound = (props: IProps) => {
    const { bundleId, sound } = props;

    const [displaySound, setDisplaySound] = React.useState<boolean>(true);

    const { state } = useMainContext();
    const { showAll, search } = state.filter;

    const { image } = useImage(bundleId, sound.id, sound.movie);
    const { onQueueSound } = useSound(bundleId, sound.id, sound.movie);
    const { manageFavorite } = useFavorite(bundleId, sound.id, sound.movie);

    React.useEffect(() => {

        const filteringCondition = showAll || sound.favorite;
        let searchingCondition = true;

        if (search.length > 0) {
            const normalizedSearch = search.toLowerCase().normalize('NFC');
            const normalizedTitle = sound.quote.toLowerCase().normalize('NFC');

            searchingCondition = normalizedTitle.includes(normalizedSearch);
        }

        setDisplaySound(filteringCondition && searchingCondition);
    }, [search, showAll, sound.favorite, sound.quote])

    return (
        <>
            {
                displaySound &&
                <div className="Sound-card">
                    <div onClick={onQueueSound}>
                        <img className="Sound-img" src={image} alt={sound.title} />
                        <h4 className="Sound-title">{sound.title}</h4>
                    </div>
                    <button onClick={manageFavorite}>
                        {
                            sound.favorite ? 'Remove' : 'Add'
                        }
                    </button>
                </div>
            }
        </>
    );
}

export default Sound;
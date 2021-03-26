import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { useMainContext } from '../hooks/useContext';
import useFavorite from '../hooks/useFavorite';
import useImage from '../hooks/useImage';
import useLocalStorage from '../hooks/useLocalStorage';
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
    const [isOnCardOver, setIsOnCardOver] = React.useState<boolean>(false);
    const [showFavorite, setShowFavorite] = React.useState<boolean>(false);

    const { state } = useMainContext();
    const { showAll, search } = state.filter;

    const { image } = useImage(bundleId, sound.id, sound.movie);
    const { onQueueSound } = useSound(bundleId, sound.id, sound.movie);
    const { manageFavorite } = useFavorite(bundleId, sound.id, sound.movie);
    const { add, remove } = useLocalStorage(bundleId, sound.id);

    const changeFavorite = React.useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>, favorite: boolean) => {
        e.stopPropagation();

        manageFavorite();

        if (favorite) {
            add()
        } else {
            remove();
        }
    }, [add, manageFavorite, remove]);

    React.useEffect(() => {
        if (isOnCardOver) {
            setShowFavorite(true);
        } else {
            setShowFavorite(sound.favorite);
        }
    }, [isOnCardOver, sound.favorite]);

    React.useEffect(() => {

        const filteringCondition = showAll || sound.favorite;
        let searchingCondition = true;

        if (search.length > 0) {
            const normalizedSearch = search.toLowerCase().normalize('NFC');
            const normalizedTitle = sound.quote.toLowerCase().normalize('NFC');

            searchingCondition = normalizedTitle.includes(normalizedSearch);
        }

        setDisplaySound(filteringCondition && searchingCondition);
    }, [search, showAll, sound.favorite, sound.quote]);

    return (
        <>
            {
                displaySound &&
                <Card className="Sound-card" onClick={onQueueSound} onMouseEnter={() => setIsOnCardOver(true)} onMouseLeave={() => setIsOnCardOver(false)}>
                    {
                        image ?
                            <>
                                <Card.Img variant="top" src={image} />
                                <Card.ImgOverlay className="Sound-overlay">
                                    <i className={`Sound-favorite ${sound.favorite ? 'bi-star-fill' : 'bi-star'} ${showFavorite ? 'Sound-favorite-icon-show' : 'Sound-favorite-icon-hide'}`} onClick={(e) => changeFavorite(e, !sound.favorite)}></i>
                                </Card.ImgOverlay>
                                <Card.Body className="Sound-body">
                                    <Card.Title className="Sound-title ">{sound.title}</Card.Title>
                                </Card.Body>
                            </>
                            :
                            <>
                                <Card.Body className="Sound-body">
                                    <Spinner animation="border" variant="success" className="Sound-spinner" />
                                </Card.Body>
                            </>
                    }
                </Card>
            }
        </>
    );
}

export default Sound;
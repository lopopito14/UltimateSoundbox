import React from 'react';
import { useMainContext } from '../hooks/useContext';
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
    const { showAll } = state.filter;

    const { image } = useImage(bundleId, sound.id, sound.movie);
    const { onQueueSound } = useSound(bundleId, sound.id, sound.movie);

    React.useEffect(() => {
        setDisplaySound(showAll || sound.favorite);
    }, [showAll, sound.favorite])

    return (
        <>
            {
                displaySound &&
                <div className="Sound-card" onClick={onQueueSound}>
                    <img className="Sound-img" src={image} alt={sound.title} />
                    <h4 className="Sound-title">{sound.title}</h4>
                </div>
            }
        </>
    );
}

export default Sound;
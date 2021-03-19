import React from 'react';
import { useContext } from '../hooks/useContext';
import useSoundPlayer from '../hooks/useSoundPlayer';
import "./Sound.css";

const SoundPlayer = () => {

    const { context } = useContext();

    const { audioSource, onEnded, onPlaying } = useSoundPlayer();

    const audio = React.useRef<HTMLAudioElement>(null);

    React.useEffect(() => {
        if (audio.current) {
            audio.current.addEventListener('playing', onPlaying);
            audio.current.addEventListener('ended', onEnded);
        }

        return () => {
            if (audio.current) {
                audio.current.removeEventListener('playing', onPlaying);
                audio.current.removeEventListener('ended', onEnded);
            }
        }
    }, [audio, onEnded, onPlaying]);

    React.useEffect(() => {
        if (audioSource) {
            audio.current?.play();
        }
    }, [audioSource]);

    return (
        <div>
            <h3>{context.state.queue.sounds.length} sound(s) to play !</h3>
            <audio src={audioSource} ref={audio} />
            <div>
                {
                    context.state.queue.sounds.map((sound, i) =>
                        <div key={`${sound}_${i}`}>
                            {sound}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default SoundPlayer;
import React from 'react';
import { useContext } from '../hooks/useContext';
import useSignalR from '../hooks/useSignalR';
import useSoundPlayer from '../hooks/useSoundPlayer';
import "./Sound.css";

const SoundPlayer = () => {

    const { context } = useContext();

    const { audioSource, onEnded, onPlaying } = useSoundPlayer();
    useSignalR();

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
            {
                context.state.local ?
                    <div>
                        <h3>{context.state.queue.internalSounds.length} internal sound(s) to play !</h3>
                        <audio src={audioSource} ref={audio} />
                        <div>
                            {
                                context.state.queue.internalSounds.map((sound, i) =>
                                    <div key={`${sound.soundUrl}_${i}`}>
                                        <div>{sound.soundUrl}</div>
                                    </div>
                                )
                            }
                        </div>
                    </div> :
                    <div>
                        <h3>{context.state.queue.receivedSounds.length} received sound(s) to play !</h3>
                        <audio src={audioSource} ref={audio} />
                        <div>
                            {
                                context.state.queue.receivedSounds.map((sound, i) =>
                                    <div key={`${sound.soundUrl}_${i}`}>
                                        <div>{sound.soundUrl} - {sound.sender}</div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
            }
        </div>
    )
}

export default SoundPlayer;
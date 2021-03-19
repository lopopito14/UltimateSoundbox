import React from "react";
import { useContext } from "./useContext";

const useSoundPlayer = () => {

    const { context } = useContext();

    const [audioSource, setAudioSource] = React.useState<string | undefined>(undefined);

    const onEnded = React.useCallback(() => {
        setAudioSource(undefined);
    }, []);

    const onPlaying = React.useCallback(() => {
        context.dispatch({ type: 'popSound' });
    }, [context]);

    React.useEffect(() => {

        const fetchSound = async (url: string) => {
            const response = await fetch(url);
            const base64 = await response.text();

            setAudioSource(base64);
        }

        if (!audioSource && context.state.queue.sounds.length > 0) {
            fetchSound(context.state.queue.sounds[0]);
        }
    }, [audioSource, context.state.queue.sounds]);

    return { audioSource, onEnded, onPlaying }
}

export default useSoundPlayer;
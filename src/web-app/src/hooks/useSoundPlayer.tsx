import React from "react";
import { IInternalSound } from "../interfaces";
import { useContext } from "./useContext";

const useSoundPlayer = () => {

    const { context } = useContext();

    const [audioSource, setAudioSource] = React.useState<string | undefined>(undefined);

    const onSoundEnded = React.useCallback(() => {
        setAudioSource(undefined);
    }, []);

    const onSoundPlaying = React.useCallback(() => {
        if (context.state.local) {
            context.dispatch({ type: 'popInternalSound' });
        } else {
            context.dispatch({ type: 'popReceivedSound' });
        }
    }, [context]);

    React.useEffect(() => {

        const fetchSound = async (internalSound: IInternalSound) => {
            const response = await fetch(internalSound.soundUrl);
            const base64 = await response.text();

            setAudioSource(base64);
        }

        if (!audioSource) {
            if (context.state.local && context.state.queue.internalSounds.length > 0) {
                fetchSound(context.state.queue.internalSounds[0]);
            } else if (!context.state.local && context.state.queue.receivedSounds.length > 0) {
                fetchSound(context.state.queue.receivedSounds[0]);
            }
        }

    }, [audioSource, context.state.local, context.state.queue.internalSounds, context.state.queue.receivedSounds]);

    return { audioSource, onEnded: onSoundEnded, onPlaying: onSoundPlaying }
}

export default useSoundPlayer;
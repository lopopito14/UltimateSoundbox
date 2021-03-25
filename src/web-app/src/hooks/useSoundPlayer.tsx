import React from "react";
import { IInternalSound } from "../interfaces";
import { useContext } from "./useContext";

const useSoundPlayer = () => {

    const { context } = useContext();

    const { queue } = context.state;

    const [audioSource, setAudioSource] = React.useState<string | undefined>(undefined);

    const onEnded = React.useCallback(() => {
        setAudioSource(undefined);
    }, []);

    const onPlaying = React.useCallback(() => {
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
            if (context.state.local && queue.internalSounds.length > 0) {
                fetchSound(queue.internalSounds[0]);
            } else if (!context.state.local && queue.receivedSounds.length > 0) {
                fetchSound(queue.receivedSounds[0]);
            }
        }

    }, [audioSource, context.state.local, queue.internalSounds, queue.receivedSounds]);

    return { queue, audioSource, onEnded, onPlaying }
}

export default useSoundPlayer;
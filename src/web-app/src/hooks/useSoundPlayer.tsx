import React from "react";
import { IInternalSound } from "../interfaces";
import { useMainContext, Types } from "./useContext";

const useSoundPlayer = () => {

    const { state, dispatch } = useMainContext();

    const { queue, offline } = state;

    const [audioSource, setAudioSource] = React.useState<string | undefined>(undefined);

    const onEnded = React.useCallback(() => {
        setAudioSource(undefined);
    }, []);

    const onPlaying = React.useCallback(() => {
        if (offline) {
            dispatch({ type: Types.POP_INTERNAL_SOUND });
        } else {
            dispatch({ type: Types.POP_RECEIVED_SOUND });
        }
    }, [dispatch, offline]);

    React.useEffect(() => {

        const fetchSound = async (internalSound: IInternalSound) => {
            try {
                const response = await fetch(internalSound.soundUrl);
                const base64 = await response.text();

                setAudioSource(base64);
            } catch (e) {
                dispatch({ type: Types.PUSH_ERROR_ACTION, payload: e });
            }
        }

        if (!audioSource) {
            if (offline && queue.internalSounds.length > 0) {
                fetchSound(queue.internalSounds[0]);
            } else if (!offline && queue.receivedSounds.length > 0) {
                fetchSound(queue.receivedSounds[0]);
            }
        }

    }, [audioSource, dispatch, queue.internalSounds, queue.receivedSounds, offline]);

    return { offline, queue, audioSource, onEnded, onPlaying }
}

export default useSoundPlayer;
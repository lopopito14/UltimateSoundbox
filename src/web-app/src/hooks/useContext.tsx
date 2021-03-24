import React, { Dispatch } from "react";
import { IQueue } from "../interfaces";
import * as microsoftTeams from "@microsoft/teams-js";

type PushInternalSoundAction = { type: 'pushInternalSound', sound: string };
type PopInternalSoundAction = { type: 'popInternalSound' };
type PushSentSoundAction = { type: 'pushSentSound', sound: string };
type PopSentSoundAction = { type: 'popSentSound' };
type PushReceivedSoundAction = { type: 'pushReceivedSound', sound: string };
type PopReceivedSoundAction = { type: 'popReceivedSound' };
type GetContextAction = { type: 'getContext', context: microsoftTeams.Context };
type UpdateThemeAction = { type: 'updateTheme', theme: string };
type TActions = PushInternalSoundAction | PopInternalSoundAction | PushSentSoundAction | PopSentSoundAction | PushReceivedSoundAction | PopReceivedSoundAction | GetContextAction | UpdateThemeAction;
type TDispatch = (action: TActions) => void;
type TState = {
    queue: IQueue,
    local: boolean,
    context?: microsoftTeams.Context,
};
type MainProviderProps = { children: React.ReactNode };
const InitialState: TState = {
    queue: {
        internalSounds: [],
        sentSounds: [],
        receivedSounds: []
    },
    local: true,
    context: undefined,
};

export interface IContextProps {
    state: TState;
    dispatch: Dispatch<TActions>;
}

const MainContext = React.createContext<{ state: TState; dispatch: TDispatch }>({
    dispatch: () => { },
    state: InitialState,
});

const mainReducer = (state: TState, action: TActions): TState => {
    switch (action.type) {
        case 'pushInternalSound': {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    internalSounds: [
                        ...state.queue.internalSounds,
                        action.sound
                    ]
                }
            }
        }
        case 'popInternalSound': {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    internalSounds: state.queue.internalSounds.slice(1)
                }
            }
        }
        case 'pushSentSound': {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    sentSounds: [
                        ...state.queue.sentSounds,
                        action.sound
                    ]
                }
            }
        }
        case 'popSentSound': {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    sentSounds: state.queue.sentSounds.slice(1)
                }
            }
        }
        case 'pushReceivedSound': {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    receivedSounds: [
                        ...state.queue.receivedSounds,
                        action.sound
                    ]
                }
            }
        }
        case 'popReceivedSound': {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    receivedSounds: state.queue.receivedSounds.slice(1)
                }
            }
        }
        case 'getContext': {
            return {
                ...state,
                context: action.context,
                local: action.context?.channelId === undefined
            }
        }
        case 'updateTheme': {
            if (state.context) {
                return {
                    ...state,
                    context: {
                        ...state.context,
                        theme: action.theme
                    }
                }
            }

            return state;
        }
        default: {
            return state;
        }
    }
}

const MainProvider = ({ children }: MainProviderProps) => {
    const [state, dispatch] = React.useReducer(mainReducer, InitialState);
    const value = { state, dispatch };

    return (
        <MainContext.Provider value={value}>
            {children}
        </MainContext.Provider>
    )
}

const useContext = () => {
    const context = React.useContext(MainContext);

    return { context };
}

export { MainProvider, useContext };
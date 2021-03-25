import React from "react";
import { IExternalSound, IInternalSound, IQueue, ISoundbox } from "../interfaces";
import * as microsoftTeams from "@microsoft/teams-js";

export interface TypedAction<T> {
    type: T;
}

export interface Action<T, P> extends TypedAction<T> {
    payload: P;
}

export enum Types {
    LOAD_SOUNDBOX = 'LOAD_SOUNDBOX',
    FILTER_SOUNDBOX = 'FILTER_SOUNDBOX',

    PUSH_INTERNAL_SOUND = 'PUSH_INTERNAL_SOUND',
    POP_INTERNAL_SOUND = 'POP_INTERNAL_SOUND',
    PUSH_SENT_SOUND = 'PUSH_SENT_SOUND',
    POP_SENT_SOUND = 'POP_SENT_SOUND',
    PUSH_RECEIVED_SOUND = 'PUSH_RECEIVED_SOUND',
    POP_RECEIVED_SOUND = 'POP_RECEIVED_SOUND',

    GET_CONTEXT = 'GET_CONTEXT',
    UPDATE_THEME = 'UPDATE_THEME',

    PUSH_ERROR_ACTION = 'PUSH_ERROR_ACTION',
    POP_ERROR_ACTION = 'POP_ERROR_ACTION'
}

type LoadSoundboxAction = Action<Types.LOAD_SOUNDBOX, ISoundbox>;
type FilterSoundboxAction = Action<Types.FILTER_SOUNDBOX, boolean>;
type PushInternalSoundAction = Action<Types.PUSH_INTERNAL_SOUND, IInternalSound>;
type PopInternalSoundAction = TypedAction<Types.POP_INTERNAL_SOUND>;
type PushSentSoundAction = Action<Types.PUSH_SENT_SOUND, IExternalSound>;
type PopSentSoundAction = TypedAction<Types.POP_SENT_SOUND>;
type PushReceivedSoundAction = Action<Types.PUSH_RECEIVED_SOUND, IExternalSound>;
type PopReceivedSoundAction = TypedAction<Types.POP_RECEIVED_SOUND>;
type GetContextAction = Action<Types.GET_CONTEXT, microsoftTeams.Context>;
type UpdateThemeAction = Action<Types.UPDATE_THEME, string>;
type PushErrorAction = Action<Types.PUSH_ERROR_ACTION, any>;
type PopErrorAction = TypedAction<Types.POP_ERROR_ACTION>;

type SoundboxActions = LoadSoundboxAction | FilterSoundboxAction;
type SoundActions = PushInternalSoundAction | PopInternalSoundAction | PushSentSoundAction | PopSentSoundAction | PushReceivedSoundAction | PopReceivedSoundAction;
type TeamsActions = GetContextAction | UpdateThemeAction;
type ErrorActions = PushErrorAction | PopErrorAction;
type TActions = SoundboxActions | SoundActions | TeamsActions | ErrorActions;

type TDispatch = (action: TActions) => void;
type TState = {
    soundbox?: ISoundbox,
    filter: {
        showAll: boolean
    }
    queue: IQueue,
    offline: boolean,
    teamsContext?: microsoftTeams.Context,
    errors: string[]
};
type MainProviderProps = { children: React.ReactNode };
const InitialState: TState = {
    soundbox: undefined,
    filter: {
        showAll: true
    },
    queue: {
        internalSounds: [],
        sentSounds: [],
        receivedSounds: []
    },
    offline: true,
    teamsContext: undefined,
    errors: []
};

interface IContextProps {
    state: TState;
    dispatch: TDispatch;
}

const MainContext = React.createContext<IContextProps>({
    dispatch: () => { },
    state: InitialState,
});

const mainReducer = (state: TState, action: TActions): TState => {
    switch (action.type) {
        case Types.LOAD_SOUNDBOX:
        case Types.FILTER_SOUNDBOX: {
            return soundboxReducer(state, action);
        }
        case Types.PUSH_INTERNAL_SOUND:
        case Types.POP_INTERNAL_SOUND:
        case Types.PUSH_SENT_SOUND:
        case Types.POP_SENT_SOUND:
        case Types.PUSH_RECEIVED_SOUND:
        case Types.POP_RECEIVED_SOUND: {
            return soundReducer(state, action);
        }
        case Types.GET_CONTEXT:
        case Types.UPDATE_THEME: {
            return teamsReducer(state, action);
        }
        case Types.PUSH_ERROR_ACTION:
        case Types.POP_ERROR_ACTION: {
            return errorReducer(state, action);
        }
        default: {
            return state;
        }
    }
}

const soundboxReducer = (state: TState, action: SoundboxActions): TState => {
    switch (action.type) {
        case Types.LOAD_SOUNDBOX: {
            return {
                ...state,
                soundbox: action.payload
            }
        }
        case Types.FILTER_SOUNDBOX: {
            return {
                ...state,
                filter: {
                    ...state.filter,
                    showAll: action.payload
                }
            }
        }
        default: {
            return state;
        }
    }
}

const soundReducer = (state: TState, action: SoundActions): TState => {
    switch (action.type) {
        case Types.PUSH_INTERNAL_SOUND: {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    internalSounds: [
                        ...state.queue.internalSounds,
                        action.payload
                    ]
                }
            }
        }
        case Types.POP_INTERNAL_SOUND: {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    internalSounds: state.queue.internalSounds.slice(1)
                }
            }
        }
        case Types.PUSH_SENT_SOUND: {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    sentSounds: [
                        ...state.queue.sentSounds,
                        action.payload
                    ]
                }
            }
        }
        case Types.POP_SENT_SOUND: {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    sentSounds: state.queue.sentSounds.slice(1)
                }
            }
        }
        case Types.PUSH_RECEIVED_SOUND: {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    receivedSounds: [
                        ...state.queue.receivedSounds,
                        action.payload
                    ]
                }
            }
        }
        case Types.POP_RECEIVED_SOUND: {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    receivedSounds: state.queue.receivedSounds.slice(1)
                }
            }
        }
        default: {
            return state;
        }
    }
}

const teamsReducer = (state: TState, action: TeamsActions): TState => {
    switch (action.type) {
        case Types.GET_CONTEXT: {
            return {
                ...state,
                teamsContext: action.payload,
                offline: action.payload?.channelId === undefined
            }
        }
        case Types.UPDATE_THEME: {
            if (state.teamsContext) {
                return {
                    ...state,
                    teamsContext: {
                        ...state.teamsContext,
                        theme: action.payload
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

const errorReducer = (state: TState, action: ErrorActions): TState => {
    switch (action.type) {
        case Types.PUSH_ERROR_ACTION: {
            const typeError = action.payload as TypeError;
            if (typeError) {
                return {
                    ...state,
                    errors: [
                        ...state.errors,
                        typeError.message
                    ]
                }
            }

            return {
                ...state,
                errors: [
                    ...state.errors,
                    action.payload.toString()
                ]
            }
        }
        case Types.POP_ERROR_ACTION: {
            return {
                ...state,
                errors: state.errors.slice(1)
            }
        }
        default: {
            return state;
        }
    }
}

export const MainProvider = ({ children }: MainProviderProps) => {
    const [state, dispatch] = React.useReducer(mainReducer, InitialState);
    const value = { state, dispatch };

    return (
        <MainContext.Provider value={value}>
            {children}
        </MainContext.Provider>
    )
}

export const useMainContext = () => {
    const mainContext = React.useContext(MainContext);

    const { state, dispatch } = mainContext;

    return { state, dispatch };
}

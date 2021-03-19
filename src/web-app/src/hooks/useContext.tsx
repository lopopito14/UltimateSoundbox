import React, { Dispatch } from "react";
import { IQueue } from "../interfaces";

type TActions = { type: 'pushSound', sound: string } | { type: 'popSound' };
type TDispatch = (action: TActions) => void;
type TState = { queue: IQueue };
type MainProviderProps = { children: React.ReactNode };
const InitialState: TState = {
    queue: {
        sounds: []
    }
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
        case 'pushSound': {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    sounds: [
                        ...state.queue.sounds,
                        action.sound
                    ]
                }
            }
        }
        case 'popSound': {
            return {
                ...state,
                queue: {
                    ...state.queue,
                    sounds: state.queue.sounds.slice(1)
                }
            }
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
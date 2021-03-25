import React from 'react';
import { Types, useMainContext } from './useContext';
import * as microsoftTeams from "@microsoft/teams-js";

const useTab = () => {

    const { state, dispatch } = useMainContext();

    const { teamsContext } = state;

    React.useEffect(() => {

        if (!teamsContext) {

            microsoftTeams.getContext((teamsContext: microsoftTeams.Context) => {
                dispatch({ type: Types.GET_CONTEXT, payload: teamsContext });
            });

            microsoftTeams.registerOnThemeChangeHandler((theme: string) => {
                dispatch({ type: Types.UPDATE_THEME, payload: theme });
            });
        }

    }, [dispatch, teamsContext]);

    return { teamsContext }
}

export default useTab;
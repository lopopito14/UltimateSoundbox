import './Tab.css';
import useSoundbox from '../hooks/useSoundbox';
import * as microsoftTeams from "@microsoft/teams-js";
import React from 'react';
import SoundPlayer from '../components/SoundPlayer';
import Bundle from '../components/Bundle';
import { useContext } from '../hooks/useContext';

const Tab = () => {

    const { datas } = useSoundbox();
    const { context } = useContext();

    React.useEffect(() => {

        if (!context.state.context) {

            microsoftTeams.getContext((teamsContext: microsoftTeams.Context) => {
                context.dispatch({ type: 'getContext', context: teamsContext });
            });

            microsoftTeams.registerOnThemeChangeHandler((theme: string) => {
                context.dispatch({ type: 'updateTheme', theme: theme });
            });
        }

    }, [context]);

    return (
        <div className="Tab">
            <header className="Tab-header">
                <h1>ULTIMATE SOUNDBOX</h1>
            </header>
            <SoundPlayer />
            <h3>{context.state.context?.loginHint}</h3>
            <h3>{context.state.context?.theme}</h3>
            <main className="Tab-container">
                <div>
                    {
                        datas && datas.bundles.map(b =>
                            <Bundle key={b.id} bundle={b} />
                        )
                    }
                </div>
            </main>
        </div>
    )
}

export default Tab;
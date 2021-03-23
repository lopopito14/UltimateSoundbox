import './Tab.css';
import useSoundbox from '../hooks/useSoundbox';
import Bundle from './Bundle';
import SoundPlayer from './SoundPlayer';
import * as microsoftTeams from "@microsoft/teams-js";
import React from 'react';

interface IState {
    context?: microsoftTeams.Context,
    members?: microsoftTeams.ChatMembersInformation
}

const Tab = () => {

    const [teams, setTeams] = React.useState<IState>({});
    const { datas } = useSoundbox();

    React.useEffect(() => {
        microsoftTeams.getContext((context: microsoftTeams.Context) => {
            console.log(context);

            setTeams((prev) => {
                return {
                    ...prev,
                    context: context
                };
            })
        });
        microsoftTeams.settings.getSettings((set) => {
            console.log(set);
        });
        microsoftTeams.getUserJoinedTeams((res) => {
            console.log(res);
        });
        microsoftTeams.getChatMembers((members: microsoftTeams.ChatMembersInformation) => {
            console.log("get chat members !!!");

            console.log(members);
            setTeams((prev) => {
                return {
                    ...prev,
                    members: members
                };
            })
        });
        microsoftTeams.registerOnThemeChangeHandler((theme) => {
            // todo => update css
        });
    }, []);

    return (
        <div className="Tab">
            <header className="Tab-header">
                <h1>ULTIMATE SOUNDBOX</h1>
            </header>
            <SoundPlayer />
            <h3>
                {
                    teams.context && teams.context.loginHint ? teams.context.loginHint : "unknown..."
                }
            </h3>
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
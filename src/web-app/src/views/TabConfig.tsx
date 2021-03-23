import * as microsoftTeams from "@microsoft/teams-js";
import React from "react";

const TabConfig = () => {

    React.useEffect(() => {

        microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {

            let baseUrl = `${window.location.origin}`;

            microsoftTeams.settings.setSettings({
                suggestedDisplayName: "Main",
                entityId: "Test",
                contentUrl: baseUrl + "/tab",
                websiteUrl: baseUrl + '/tab'
            });
            saveEvent.notifySuccess();
        });

        microsoftTeams.settings.setValidityState(true);
    }, []);

    return (
        <div>
            <h1>Tab Configuration</h1>
            <div>
                This is where you will add your tab configuration options the user
                can choose when the tab is added to your team/group chat.
          </div>
        </div>
    )
}

export default TabConfig;
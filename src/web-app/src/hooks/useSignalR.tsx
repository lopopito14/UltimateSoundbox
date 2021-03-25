import React from 'react';
import { useContext } from './useContext';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { IExternalSound, IGroupMessage, IJoinGroupMessage, ILeaveGroupMessage, IMessage, IPersonnalMessage } from '../interfaces';

const useSignalR = () => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const [connection, setConnection] = React.useState<HubConnection | undefined>(undefined);
    const [hasNegociate, setHasNegociate] = React.useState<boolean>(false);

    const { context } = useContext();

    const newPersonnalMessage = React.useCallback((data: any) => {
        const message = data as IMessage;
        if (message) {
            context.dispatch({
                type: 'pushReceivedSound',
                externalSound: {
                    soundUrl: message.url,
                    sender: message.sender
                }
            });
        }
    }, [context]);

    const newGroupMessage = React.useCallback((data: any) => {
        const message = data as IMessage;
        if (message) {
            if (message.sender !== context.state.context?.loginHint) {
                context.dispatch({
                    type: 'pushReceivedSound',
                    externalSound: {
                        soundUrl: message.url,
                        sender: message.sender
                    }
                });
            }
        }
    }, [context]);

    React.useEffect(() => {

        const sendGroupSound = async (externalSound: IExternalSound, groupId: string) => {
            const groupMessage: IGroupMessage = {
                sender: externalSound.sender,
                url: externalSound.soundUrl,
                groupId: groupId
            };

            await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/groupMessage`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(groupMessage)
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const sendPersonnalSound = async (externalSound: IExternalSound, userId: string) => {
            const personnalMessage: IPersonnalMessage = {
                sender: externalSound.sender,
                url: externalSound.soundUrl,
                userId: userId
            };

            await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/personnalMessage`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(personnalMessage)
            });
        }

        if (!context.state.local) {
            if (context.state.queue.sentSounds.length > 0) {
                if (context.state.context?.groupId) {
                    sendGroupSound(context.state.queue.sentSounds[0], context.state.context?.groupId);
                    context.dispatch({ type: 'popSentSound' });
                }
            }
        }
    }, [REACT_APP_AZURE_FUNCTIONS_API, context, context.state.local, context.state.queue.sentSounds])

    React.useEffect(() => {

        const subscribe = async (name: string) => {

            if (hasNegociate) {
                return;
            }

            setHasNegociate(true);

            try {
                const response = await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/negotiate`, {
                    method: 'POST',
                    headers: {
                        'name': name
                    },
                    body: null
                });

                const { url, accessToken } = await response.json() as { url: string, accessToken: string };

                const options: IHttpConnectionOptions = {
                    accessTokenFactory: () => accessToken
                }

                let connection = new HubConnectionBuilder()
                    .withUrl(url, options)
                    .configureLogging(LogLevel.Trace)
                    .build();

                setConnection(connection);
                connection.on("personnalMessage", newPersonnalMessage);
                connection.on("groupMessage", newGroupMessage);
                await connection.start();
            } catch (e) {
                console.error(e);
            }
        };

        const unSubscribe = async () => {
            try {
                if (connection) {
                    await connection.stop();
                    connection.off("personnalMessage", newPersonnalMessage);
                    connection.off("groupMessage", newGroupMessage);
                    setConnection(undefined);
                }
            } catch (e) {
                console.error(e);
            }
        };

        if (context.state.local) {
            if (connection) {
                unSubscribe();
            }
        } else {
            if (!hasNegociate && context.state.context?.loginHint) {
                subscribe(context.state.context?.loginHint);
            }
        }

    }, [REACT_APP_AZURE_FUNCTIONS_API, connection, context.state.context?.loginHint, context.state.local, hasNegociate, newGroupMessage, newPersonnalMessage]);

    React.useEffect(() => {

        const leaveGroup = async (groupId: string, userId: string) => {
            const leaveGroupMessage: ILeaveGroupMessage = {
                groupId: groupId,
                userId: userId
            };

            await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/leaveGroup`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(leaveGroupMessage)
            });
        }

        const joinGroup = async (groupId: string, userId: string) => {
            const joinGroupMessage: IJoinGroupMessage = {
                groupId: groupId,
                userId: userId
            };

            await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/joinGroup`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(joinGroupMessage)
            });
        }

        if (connection) {
            if (context.state.context?.groupId && context.state.context?.loginHint) {
                leaveGroup(context.state.context?.groupId, context.state.context?.loginHint);
                joinGroup(context.state.context?.groupId, context.state.context?.loginHint);
            }
        }
    }, [REACT_APP_AZURE_FUNCTIONS_API, connection, context.state.context?.groupId, context.state.context?.loginHint]);

    return {}
}

export default useSignalR;
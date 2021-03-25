import React from 'react';
import { Types, useMainContext } from './useContext';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { IExternalSound, IGroupMessage, IJoinGroupMessage, ILeaveGroupMessage, IMessage, IPersonnalMessage } from '../interfaces';

const useSignalR = () => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const [connection, setConnection] = React.useState<HubConnection | undefined>(undefined);
    const [hasNegociate, setHasNegociate] = React.useState<boolean>(false);

    const { state, dispatch } = useMainContext();

    const { offline, teamsContext, queue } = state;

    const newPersonnalMessage = React.useCallback((data: any) => {
        const message = data as IMessage;
        if (message) {
            dispatch({
                type: Types.PUSH_RECEIVED_SOUND,
                payload: {
                    soundUrl: message.url,
                    sender: message.sender
                }
            });
        }
    }, [dispatch]);

    const newGroupMessage = React.useCallback((data: any) => {
        const message = data as IMessage;
        if (message) {
            if (message.sender !== teamsContext?.loginHint) {
                dispatch({
                    type: Types.PUSH_RECEIVED_SOUND,
                    payload: {
                        soundUrl: message.url,
                        sender: message.sender
                    }
                });
            }
        }
    }, [dispatch, teamsContext?.loginHint]);

    React.useEffect(() => {

        const sendGroupSound = async (externalSound: IExternalSound, groupId: string) => {
            const groupMessage: IGroupMessage = {
                sender: externalSound.sender,
                url: externalSound.soundUrl,
                groupId: groupId
            };

            try {
                await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/groupMessage`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(groupMessage)
                });
            } catch (e) {
                dispatch({ type: Types.PUSH_ERROR_ACTION, payload: e });
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const sendPersonnalSound = async (externalSound: IExternalSound, userId: string) => {
            const personnalMessage: IPersonnalMessage = {
                sender: externalSound.sender,
                url: externalSound.soundUrl,
                userId: userId
            };

            try {
                await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/personnalMessage`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(personnalMessage)
                });
            } catch (e) {
                dispatch({ type: Types.PUSH_ERROR_ACTION, payload: e });
            }
        }

        if (!offline) {
            if (queue.sentSounds.length > 0) {
                if (teamsContext?.groupId) {
                    sendGroupSound(queue.sentSounds[0], teamsContext?.groupId);
                    dispatch({ type: Types.POP_SENT_SOUND });
                }
            }
        }
    }, [REACT_APP_AZURE_FUNCTIONS_API, dispatch, offline, queue.sentSounds, teamsContext?.groupId])

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
                dispatch({ type: Types.PUSH_ERROR_ACTION, payload: e });
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
                dispatch({ type: Types.PUSH_ERROR_ACTION, payload: e });
            }
        };

        if (offline) {
            if (connection) {
                unSubscribe();
            }
        } else {
            if (!hasNegociate && teamsContext?.loginHint) {
                subscribe(teamsContext?.loginHint);
            }
        }

    }, [REACT_APP_AZURE_FUNCTIONS_API, connection, dispatch, hasNegociate, newGroupMessage, newPersonnalMessage, offline, teamsContext?.loginHint]);

    React.useEffect(() => {

        const leaveGroup = async (groupId: string, userId: string) => {
            const leaveGroupMessage: ILeaveGroupMessage = {
                groupId: groupId,
                userId: userId
            };

            try {
                await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/leaveGroup`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(leaveGroupMessage)
                });
            } catch (e) {
                dispatch({ type: Types.PUSH_ERROR_ACTION, payload: e });
            }
        }

        const joinGroup = async (groupId: string, userId: string) => {
            const joinGroupMessage: IJoinGroupMessage = {
                groupId: groupId,
                userId: userId
            };

            try {
                await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/joinGroup`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(joinGroupMessage)
                });
            } catch (e) {
                dispatch({ type: Types.PUSH_ERROR_ACTION, payload: e });
            }
        }

        if (connection) {
            if (teamsContext?.groupId && teamsContext?.loginHint) {
                leaveGroup(teamsContext?.groupId, teamsContext?.loginHint);
                joinGroup(teamsContext?.groupId, teamsContext?.loginHint);
            }
        }
    }, [REACT_APP_AZURE_FUNCTIONS_API, connection, dispatch, teamsContext?.groupId, teamsContext?.loginHint]);
}

export default useSignalR;
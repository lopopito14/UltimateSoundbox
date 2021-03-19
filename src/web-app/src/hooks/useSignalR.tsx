import React from 'react';
import { useContext } from './useContext';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { IMessage } from '../interfaces';

const useSignalR = () => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const [connection, setConnection] = React.useState<HubConnection | undefined>(undefined);

    const { context } = useContext();

    const newMessage = React.useCallback((data: any) => {
        const message = data as IMessage;
        if (message) {
            context.dispatch({ type: 'pushReceivedSound', sound: message.url });
        }
    }, [context]);

    React.useEffect(() => {

        const sendSound = async (url: string) => {
            const message: IMessage = {
                sender: window.navigator.appName,
                url: url
            };

            await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/message`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            });
        }

        if (!context.state.local) {
            if (context.state.queue.sentSounds.length > 0) {
                sendSound(context.state.queue.sentSounds[0]);
                context.dispatch({ type: 'popSentSound' });
            }
        }
    }, [REACT_APP_AZURE_FUNCTIONS_API, context, context.state.local, context.state.queue.sentSounds])

    React.useEffect(() => {

        const subscribe = async () => {
            try {
                const response = await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/negotiate`, {
                    method: 'POST',
                    headers: {},
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
                connection.on("newMessage", newMessage);
                await connection.start();
            } catch (e) {
                console.error(e);
            }
        };

        const unSubscribe = async () => {
            try {
                if (connection) {
                    await connection.stop();
                    connection.off("newMessage", newMessage);
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
            if (!connection) {
                subscribe();
            }
        }

    }, [REACT_APP_AZURE_FUNCTIONS_API, connection, context.state.local, newMessage]);

    return {}
}

export default useSignalR;
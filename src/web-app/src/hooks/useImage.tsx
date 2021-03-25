import React from 'react';
import { Types, useMainContext } from './useContext';

const useImage = (bundleId: string, soundId: string, movieId: string) => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const { dispatch } = useMainContext();

    const [image, setImage] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/image/${bundleId}/${soundId}/${movieId}`);
                const base64 = await response.text();

                setImage(base64);
            } catch (e) {
                dispatch({ type: Types.PUSH_ERROR_ACTION, payload: e });
            }
        };

        fetchImage();
    }, [REACT_APP_AZURE_FUNCTIONS_API, bundleId, dispatch, movieId, soundId]);

    return { image }
}

export default useImage;
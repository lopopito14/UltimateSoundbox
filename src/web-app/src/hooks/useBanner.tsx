import React from 'react';
import { Types, useMainContext } from './useContext';

const useBanner = (bundleId: number) => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const { dispatch } = useMainContext();

    const [banner, setBanner] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/banner/${bundleId}`);
                const base64 = await response.text();

                setBanner(base64);
            } catch (e) {
                dispatch({ type: Types.PUSH_ERROR_ACTION, payload: e });
            }
        };

        fetchBanner();
    }, [REACT_APP_AZURE_FUNCTIONS_API, bundleId, dispatch]);

    return { banner }
}

export default useBanner;
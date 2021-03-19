import React from 'react';

const useBanner = (bundleId: string) => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const [banner, setBanner] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        const fetchBanner = async () => {
            const response = await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/Banner/${bundleId}`);
            const base64 = await response.text();

            setBanner(base64);
        };

        fetchBanner();
    }, [REACT_APP_AZURE_FUNCTIONS_API, bundleId]);

    return { banner }
}

export default useBanner;
import React from 'react';

const useImage = (bundleId: string, soundId: string, movieId: string) => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const [image, setImage] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        const fetchImage = async () => {
            const response = await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/Image/${bundleId}/${soundId}/${movieId}`);
            const base64 = await response.text();

            setImage(base64);
        };

        fetchImage();
    }, [REACT_APP_AZURE_FUNCTIONS_API, bundleId, movieId, soundId]);

    return { image }
}

export default useImage;
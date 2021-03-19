import React from 'react';
import { ISoundbox } from '../interfaces';

const useSoundbox = () => {
    const { REACT_APP_AZURE_FUNCTIONS_API } = process.env;

    const [datas, setDatas] = React.useState<ISoundbox | undefined>(undefined);

    React.useEffect(() => {
        const fetchDatas = async () => {
            const response = await fetch(`${REACT_APP_AZURE_FUNCTIONS_API}/Soundbox`);
            const json = await response.json() as ISoundbox;

            setDatas(json);
        };

        fetchDatas();
    }, [REACT_APP_AZURE_FUNCTIONS_API]);

    return { datas }
}

export default useSoundbox;
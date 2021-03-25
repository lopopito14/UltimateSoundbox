import React from 'react';
import { ILocalStorage } from '../interfaces';
import { Types, useMainContext } from './useContext';

const useLocalStorage = (bundleId: number, soundId: number) => {

    const [key,] = React.useState<string>('favorites');
    const [loadLocalStorage, setLoadLocalStorage] = React.useState<boolean>(true);

    const { state, dispatch } = useMainContext();

    const add = React.useCallback(() => {

        let favorite: ILocalStorage = {
            bundles: []
        };

        const value = localStorage.getItem(key);
        if (value) {
            favorite = JSON.parse(value) as ILocalStorage;
        }

        let bundle = favorite.bundles.find(b => b.id === bundleId);
        if (!bundle) {
            bundle = {
                id: bundleId,
                sounds: []
            }
            favorite.bundles.push(bundle);
        }

        let sound = bundle.sounds.find(s => s.id === soundId);
        if (!sound) {
            sound = {
                id: soundId
            };
            bundle.sounds.push(sound);
        }

        localStorage.setItem(key, JSON.stringify(favorite));
    }, [bundleId, key, soundId]);

    const remove = React.useCallback(() => {
        let favorite: ILocalStorage = {
            bundles: []
        };

        const value = localStorage.getItem(key);
        if (value) {
            favorite = JSON.parse(value) as ILocalStorage;
        }

        let bundle = favorite.bundles.find(b => b.id === bundleId);
        if (!bundle) {
            return;
        }

        let sound = bundle.sounds.find(s => s.id === soundId);
        if (!sound) {
            return;
        }

        bundle.sounds = bundle.sounds.filter(s => s.id !== sound?.id);
        if (bundle.sounds.length === 0) {
            favorite.bundles = favorite.bundles.filter(b => b.id !== bundle?.id)
        }

        localStorage.setItem(key, JSON.stringify(favorite));
    }, [bundleId, key, soundId]);

    React.useEffect(() => {
        if (state.soundbox && loadLocalStorage) {
            setLoadLocalStorage(false);
            let favorite: ILocalStorage = {
                bundles: []
            };

            const value = localStorage.getItem(key);
            if (value) {
                favorite = JSON.parse(value) as ILocalStorage;
                dispatch({ type: Types.LOAD_FAVORITES, payload: favorite });

            }
        }
    }, [dispatch, key, loadLocalStorage, state.soundbox]);

    return { add, remove };
}

export default useLocalStorage;

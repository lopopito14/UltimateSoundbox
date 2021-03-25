import React from "react";
import { Types, useMainContext } from "./useContext";

const useError = () => {

    const { state, dispatch } = useMainContext();

    const { errors } = state;

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (errors.length > 0) {
                dispatch({ type: Types.POP_ERROR_ACTION });
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [dispatch, errors.length]);

    return { errors }
}

export default useError;

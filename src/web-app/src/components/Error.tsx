import useError from '../hooks/useError';
import './Error.css';

const Error = () => {

    const { errors } = useError();

    return (
        <div>
            {
                errors.map((error, i) =>
                    <div key={`${error} - ${i}`}>
                        <div>{error}</div>
                    </div>
                )
            }
        </div>
    )
}

export default Error;
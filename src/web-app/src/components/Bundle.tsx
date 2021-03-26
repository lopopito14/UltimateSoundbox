import { IBundle } from '../interfaces';
import Sound from './Sound';
import "./Bundle.css";
import useBanner from '../hooks/useBanner';
import { Navbar } from 'react-bootstrap';

interface IProps {
    key: string;
    bundle: IBundle;
}

const Bundle = (props: IProps) => {
    const { bundle } = props;

    const { banner } = useBanner(bundle.id);

    return (
        <div>
            <Navbar bg="light" variant="light">
                <Navbar.Brand>
                    <div className="Bundle-header">
                        <img
                            alt={bundle.title}
                            src={banner}
                            width={100}
                            height={50}
                            className="d-inline-block align-top"
                        />
                        <h2>{`${bundle.title}`}</h2>
                    </div>
                </Navbar.Brand>
            </Navbar>
            <div className="Sound-container">
                {
                    bundle.sounds.map(s =>
                        <Sound key={`${s.id}`} bundleId={bundle.id} sound={s} />
                    )
                }
            </div>
        </div>
    );
}

export default Bundle;
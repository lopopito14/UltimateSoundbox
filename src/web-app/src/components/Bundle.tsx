import { IBundle } from '../interfaces';
import Sound from './Sound';
import "./Bundle.css";
import useBanner from '../hooks/useBanner';

interface IProps {
    key: string;
    bundle: IBundle;
}

const Bundle = (props: IProps) => {
    const { bundle } = props;

    const { banner } = useBanner(bundle.id);

    return (
        <div>
            <div className="Bundle-header">
                <h2>{bundle.title}</h2>
                <img src={banner} alt={bundle.title} />
            </div>
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
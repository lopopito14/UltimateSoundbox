import './Tab.css';
import useSoundbox from '../hooks/useSoundbox';
import SoundPlayer from '../components/SoundPlayer';
import Bundle from '../components/Bundle';
import Error from '../components/Error';
import useTab from '../hooks/useTab';
import Filter from '../components/Filter';
import { useMainContext } from '../hooks/useContext';

const Tab = () => {

    useSoundbox();
    const { teamsContext } = useTab();

    const { state } = useMainContext();
    const { soundbox } = state;

    return (
        <div className="Tab">
            <header className="Tab-header">
                <h1>ULTIMATE SOUNDBOX</h1>
            </header>
            <SoundPlayer />
            <h3>{teamsContext?.loginHint}</h3>
            <h3>{teamsContext?.theme}</h3>
            <Filter />
            <Error />
            <main className="Tab-container">
                <div>
                    {
                        soundbox?.bundles.map(b =>
                            <Bundle key={`${b.id}`} bundle={b} />
                        )
                    }
                </div>
            </main>
        </div>
    )
}

export default Tab;
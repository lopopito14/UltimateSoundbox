import './Tab.css';
import useSoundbox from '../hooks/useSoundbox';
import SoundPlayer from '../components/SoundPlayer';
import Bundle from '../components/Bundle';
import Error from '../components/Error';
import useTab from '../hooks/useTab';
import Filter from '../components/Filter';
import Search from '../components/Search';

const Tab = () => {

    const { soundbox } = useSoundbox();
    const { teamsContext } = useTab();

    return (
        <div className="Tab">
            <header className="Tab-header">
                <h1>ULTIMATE SOUNDBOX</h1>
                <SoundPlayer />
                {
                    teamsContext &&
                    <div>
                        <h3>{teamsContext.loginHint}</h3>
                        <h3>{teamsContext.theme}</h3>
                    </div>
                }
                <Error />
            </header>
            <section className="Tab-filter-search-section">
                <div className="Tab-filter-search-container">
                    <div className="Tab-filter">
                        <Filter />
                    </div>
                    <div className="Tab-search">
                        <Search />
                    </div>
                </div>
            </section>
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
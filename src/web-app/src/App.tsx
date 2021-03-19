import './App.css';
import Bundle from './components/Bundle';
import SoundPlayer from './components/SoundPlayer';
import useSoundbox from './hooks/useSoundbox';

const App = () => {

  const { datas } = useSoundbox();

  return (
    <div className="App">
      <header className="App-header">
        <h1>ULTIMATE SOUNDBOX</h1>
      </header>
      <SoundPlayer />
      <main className="App-container">
        <div>
          {
            datas && datas.bundles.map(b =>
              <Bundle key={b.id} bundle={b} />
            )
          }
        </div>
      </main>
    </div>
  );
}

export default App;

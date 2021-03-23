
import { BrowserRouter, Route } from "react-router-dom";
import TermsOfUse from './components/TermsOfUse';
import Tab from './components/Tab';
import TabConfig from './components/TabConfig';
import * as microsoftTeams from "@microsoft/teams-js";

const App = () => {
  microsoftTeams.initialize(() => {
    microsoftTeams.appInitialization.notifySuccess();
  });

  return (
    <BrowserRouter>
      <div>
        <Route exact path="/tab" component={Tab} />
        <Route exact path="/termsofuse" component={TermsOfUse} />
        <Route exact path="/config" component={TabConfig} />
      </div>
    </BrowserRouter>
  );
}

export default App;

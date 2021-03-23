
import { BrowserRouter, Route } from "react-router-dom";
import TermsOfUse from './views/TermsOfUse';
import Tab from './views/Tab';
import TabConfig from './views/TabConfig';
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

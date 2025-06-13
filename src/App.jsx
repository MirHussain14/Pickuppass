import Page from "./Page";
import "@vibe/core/tokens";

const App = () => {

  return (
    <div className="App">
      {/* Animated Background Orbs */}
      <div className="app-background-decoration">
        <div className="app-floating-orb app-orb-1"></div>
        <div className="app-floating-orb app-orb-2"></div>
        <div className="app-floating-orb app-orb-3"></div>
        <div className="app-floating-orb app-orb-4"></div>
        <div className="app-floating-orb app-orb-5"></div>
        <div className="app-floating-orb app-orb-6"></div>
      </div>
      
      <Page />
    </div>
  );
};

export default App;
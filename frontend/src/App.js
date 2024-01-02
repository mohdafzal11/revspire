import "./App.css";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import "./variables.css";
import GlobalContextProvider from "./components/context/GlobalProvider";
import Content from "./components/Content";

function App() {

  return (
    <GlobalContextProvider>
      <div className="app-container">
        <Sidebar />
        <div className="content-container">
          <Header />
          <Content />
        </div>
      </div>
    </GlobalContextProvider>
  );
}

export default App;

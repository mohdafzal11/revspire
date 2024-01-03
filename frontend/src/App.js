import "./App.css";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import "./variables.css";
import GlobalContextProvider from "./components/context/GlobalProvider";
import Content from "./components/Content";
import Folder from "./components/Folder";

function App() {

  return (
    <GlobalContextProvider>
      <div className="app-container bg-[#fafafa] h-screen w-full overflow-x-hidden">
        <Sidebar />
        <div className="content-container">
          <Header />
          <div className="border-2 rounded-lg pl-[10px]">
            <Folder />
            <Content />
          </div>
          {/* <FolderContent/> */}
        </div>
      </div>
    </GlobalContextProvider>
  );
}

export default App;

import React, { useState } from "react";
import "./header.css";
import moon from "../assets/images/moon.png";
import user from "../assets/images/user.png";
import sun from "../assets/images/sun.png";
import dropDownLight from "../assets/images/dropdown-light.png";
import dropDownDark from "../assets/images/dropdown-dark.png";
import menuDark from "../assets/images/menu-dark.png";
import menuLight from "../assets/images/menu-light.png";
import { contentData } from "../assets/data.js"; // Import the data
import { useContext } from "react";
import GlobalContext from "./context/GlobalContext.js";

export function Header() {

  const { theme, setTheme, showRenameButton, setShowRenamePopup } = useContext(GlobalContext);

  let toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }


  // my variblers
  let viewer_id = 1;
  let toggleSidebar = () => {

  }

  let order = 1
  let sortOption = 1
  let setViewer_id = 1
  let setOrder = 1
  let setSortOption = 1
  let setFolder_id = 1




  const [viewerIdInput, setViewerIdInput] = useState("");
  const [folderIdInput, setFolderIdInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  //  Handler funtion for showing the rename button
  const renameButtonHandler = () => {
    setShowRenamePopup(true)
  }

  // Function to find viewer's name based on viewer_id
  const findViewerName = () => {
    const viewer = contentData.find((user) => user.id === viewer_id);
    return viewer ? viewer.name : "";
  };

  // Handler function for the onChange event for sorting
  const handleSelectChangeSort = (event) => {
    setOrder(event.target.value);
  };

  // Handler function for the onChange event for filtering
  const handleSelectChangeFilter = (event) => {
    setSortOption(event.target.value);
  };

  // Handler function for the input field change (Viewer Id)
  const handleViewerIdChange = (event) => {
    setViewerIdInput(event.target.value);
  };

  // Handler function for the input field change (Folder Id)
  const handleFolderIdChange = (event) => {
    setFolderIdInput(event.target.value);
  };

  // Handler function for the "Switch User" button click
  const handleSwitchUser = () => {
    // Use the values stored in the state variables
    setViewer_id(viewerIdInput);
    setFolder_id(folderIdInput);
    // Add any additional logic or actions you need
    handleDropDown();
  };

  // Handler function for the dropdown toggle
  const handleDropDown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleCancelUser = () => {
    // Use the values stored in the state variables
    handleDropDown();
    // Add any additional logic or actions you need
  };
  const name = findViewerName();

  const path = "Root > Marketing > 2023 > Gated Content";
  return (
    <div className="header-box">
      <div className="header">
        <div className="header-slidebar-btn" onClick={toggleSidebar}>
          <img src={theme === "light" ? menuLight : menuDark} />
        </div>
        <div className="header-left">
          <p className="rev-txt">RevSpire Enablement</p>
          <div className="header-left-searchbox">
            <input
              className="search-input"
              type="text"
              placeholder="Hinted search text"
            />
          </div>
        </div>
        <div className="header-btn">
          <img
            src={theme === "light" ? moon : sun}
            alt="Theme Toggle"
            onClick={toggleTheme}
          />
        </div>

        <div className="header-profile">
          <div className="profile-btn">
            <div className="profile-btn-left">
              <img src={user} alt="User" />
              <p>{name ? name : "Anirudh Krishnan"}</p>
            </div>
            <div
              className="profile-btn-right"
              onMouseEnter={() => {
                handleDropDown();
              }}
            >
              <img src={theme === "light" ? dropDownDark : dropDownLight} />
            </div>
          </div>
          <div
            className={dropdownOpen ? "dropdown-body" : "dropdown-body-close"}
          >
            <ul className="dropdown-ul">
              <li className="dropdown-li dropdown-li-F ">
                <input
                  type="text"
                  placeholder="Viewer id"
                  onChange={handleViewerIdChange}
                />
              </li>
              <li className="dropdown-li">
                <input
                  type="text"
                  placeholder="Folder id"
                  onChange={handleFolderIdChange}
                />
              </li>
              <li className="dropdown-li dropdown-li-btns">
                <button onClick={handleSwitchUser} className="dropdown-btn">
                  Switch User
                </button>
                <button onClick={handleCancelUser} className="dropdown-btn">
                  Close
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="header-2">
        <div>
          {!showRenameButton && <button className='mr-[20px] w-[100px] py-[2px] rounded-full px-[15px] border-2 border-gray-400'>Add</button>}
          {showRenameButton && <div className="flex">
            <button className='mr-[20px] w-[100px] py-[2px] rounded-full px-[15px] border-2 border-gray-400' onClick={() => { renameButtonHandler() }}>Rename</button>
            <button className='mr-[20px] w-[100px] py-[2px] rounded-full px-[15px] border-2 border-gray-400'>Move</button>
            <button className='mr-[20px] w-[100px] py-[2px] rounded-full px-[15px] border-2 border-gray-400'>Copy</button>
            <button className='mr-[20px] w-[100px] py-[2px] rounded-full px-[15px] border-2 border-gray-400'>Download</button>
            <button className='mr-[20px] w-[100px] py-[2px] rounded-full px-[15px] border-2 border-gray-400'>Delete</button>
          </div>}
          <div className="header2-path">
            <p className="mt-[10px]">{path}</p>
          </div>
        </div>
        <div className="header2-dropdowns">
          <div className="header-2-sort">
            <select
              className="header2-select"
              value={order}
              onChange={handleSelectChangeSort}
            >
              <option value="" disabled hidden>
                Sort
              </option>
              <option value="ASC" className="header2-options">
                ASC
              </option>
              <option value="DESC" className="header2-options">
                DESC
              </option>
            </select>
          </div>

          <div className="header-2-filter">
            <select
              className="header2-select"
              value={sortOption}
              onChange={handleSelectChangeFilter}
            >
              <option value="" disabled hidden>
                Filter
              </option>
              <option value="name" className="header2-options">
                Name
              </option>
              <option value="updated_at" className="header2-options">
                Modified
              </option>
              <option value="created_at" className="header2-options">
                Created
              </option>
              <option value="id" className="header2-options">
                ID
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

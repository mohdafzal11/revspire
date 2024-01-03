import React, { useState, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import axios from 'axios'

const GlobalContextProvider = ({ children }) => {

    // showing the rename button
    const [showRenameButton, setShowRenameButton] = useState(false);

    // this state is for theme
    const [theme, setTheme] = useState('light')

    // this state contains all the data
    const [data, setData] = useState({});


    // state popup is shown or not
    // const [selectRename, setSelectRename] = useState(false)
    const [showRenamePopup, setShowRenamePopup] = useState(false);


    // this state is containing the new name
    const [renameValue, setRenameValue] = useState("")

    // this state is for selected item to change
    const [selectItemById, setSelectItemById] = useState({})

    // this state is used to show a successBanner
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);

    const fetchAllContent = async () => {
        const apiUrl = 'http://localhost:3000/view-all-content';
        axios.get(apiUrl)
            .then(response => {
                setData(response.data)
            })
            .catch(error => {
                console.log(error)
            })

    }

    useEffect(() => {
        fetchAllContent()
    }, [])


    // handler function for saving the data to the database
    const updateButtonHandler = async () => {

        const updatedData = {
            updated_by: selectItemById.updated_by,
            mimetype: selectItemById.mimetype,
            name: renameValue,
        }

        const apiUrl = `http://localhost:3000/edit-content/${selectItemById.id}`
        axios.patch(apiUrl, updatedData)
            .then(response => {
                fetchAllContent()
                setShowRenameButton(false)
                setShowRenamePopup(false)
                setShowSuccessBanner(true);

                setTimeout(() => {
                    setShowSuccessBanner(false);
                }, 5000);

                console.log("COntent updated successflyyu", response.data);
            })
            .catch(error => (
                console.log(error)
            ))
    };

    return (
        <GlobalContext.Provider value={{ showSuccessBanner, updateButtonHandler, selectItemById, setSelectItemById, renameValue, setRenameValue, showRenameButton, setShowRenameButton, theme, setTheme, data, setData, showRenamePopup, setShowRenamePopup }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;
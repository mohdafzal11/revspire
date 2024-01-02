import React, { useState, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import axios from 'axios'

const GlobalContextProvider = ({ children }) => {

    // this state is for checkbox is selected or not
    const [selectedItem, setSelectedItem] = useState(false)

    // this state is for theme
    const [theme, setTheme] = useState('light')

    // this state contains all the data
    const [data, setData] = useState({});


    // this state is for popup is shown or not
    const [selectRename, setSelectRename] = useState(false)

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



    const updateContentHandler = async () => {

        const updatedData = {
            updated_by: selectItemById.updated_by,
            mimetype: selectItemById.mimetype,
            name: renameValue,
        }

        const apiUrl = `http://localhost:3000/edit-content/${selectItemById.id}`
        axios.patch(apiUrl, updatedData)
            .then(response => {
                fetchAllContent()
                setSelectedItem(false)
                setSelectRename(false)
                setShowSuccessBanner(true);

                setTimeout(() => {
                    setShowSuccessBanner(false);
                }, 2000);

                console.log("COntent updated successflyyu", response.data);
            })
            .catch(error => (
                console.log(error)
            ))
    };

    return (
        <GlobalContext.Provider value={{ showSuccessBanner, updateContentHandler, selectItemById, setSelectItemById, renameValue, setRenameValue, selectedItem, setSelectedItem, theme, setTheme, data, setData, selectRename, setSelectRename }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;
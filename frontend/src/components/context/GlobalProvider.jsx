import React, { useState, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import axios from 'axios'

const GlobalContextProvider = ({ children }) => {

    // showing the rename button
    const [showRenameButton, setShowRenameButton] = useState(false);

    // this state is for theme
    const [theme, setTheme] = useState('light')

    //  state contains all the data
    const [data, setData] = useState({});

    //state contains all the  folder data
    const [foldersData, setFoldersData] = useState({})

   

    // state popup is shown or not
    const [showRenamePopup, setShowRenamePopup] = useState(false);


    // this state is containing the new name
    const [renameValue, setRenameValue] = useState("")

    // this state is for selected item to change
    const [selectItemById, setSelectItemById] = useState({})

    // this state is used to show a successBanner
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);


    const [tableName , setTableName]=useState('');

    const fetchAllFolder = async () => {
        const apiFolderUrl = 'http://localhost:3000/view-all-folders';
        axios.get(apiFolderUrl)
            .then(response => {
                setFoldersData(response.data)

            })
            .catch(error => {
                console.log(error)
            })
    }


    const fetchAllContent = async () => {
        const apiContentUrl = 'http://localhost:3000/view-all-content';
        axios.get(apiContentUrl)
            .then(response => {
                setData(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }
    useEffect(() => {
        fetchAllContent()
        fetchAllFolder()
    }, [])


    //  handler function for getting the tablename
    const getTableNameHandler =async () => {
        const data = { "record_id": selectItemById.id };
        const apiUrl = 'http://localhost:3000/get-table-name'

        axios.post(apiUrl, data)
            .then(response => {
               setTableName(response.data.tablename);
                
            })
            .catch(error => {
                console.log(error.message)
            })
             .then(()=>{
                updateButtonHandler()
             })
    }
    
    // handler function for saving the data to the database
    const updateButtonHandler = async () => {
        let updatedData;

        let apiUrl ;
        console.log(tableName)
        if(selectItemById.id.substring(0,3)==="KBD"){
            apiUrl=`http://localhost:3000/edit-content/${selectItemById.id}`
            updatedData={
                updated_by: selectItemById.updated_by,
                mimetype: selectItemById.mimetype,
                name: renameValue,
            }
        }
        else{
            apiUrl=`http://localhost:3000/edit-folder/${selectItemById.id}`
            updatedData={
                updated_by: selectItemById.updated_by,
                name:renameValue,
                parent_folder:selectItemById.parent_folder
            }
        }
        axios.patch(apiUrl, updatedData)
            .then(response => {
                setShowRenameButton(false)
                setShowRenamePopup(false)
                setShowSuccessBanner(true);
                fetchAllContent()
                fetchAllFolder()
                setSelectItemById({})
                setRenameValue("")

                setTimeout(() => {
                    setShowSuccessBanner(false);
                }, 5000);

                console.log("COntent updated successfully", response.data);
            })
            .catch(error => (
                console.log(error)
            ))
    };

    return (
        <GlobalContext.Provider
            value={{
                foldersData,
                showSuccessBanner,
                updateButtonHandler,
                selectItemById,
                setSelectItemById,
                renameValue,
                setRenameValue,
                showRenameButton,
                setShowRenameButton,
                theme,
                setTheme,
                data,
                setData,
                showRenamePopup,
                setShowRenamePopup,
                getTableNameHandler,
            }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;
import React, { useState, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import axios from 'axios'

const GlobalContextProvider = ({ children }) => {
    const [selectedItem, setSelectedItem] = useState(false)
    const [theme, setTheme] = useState('light')
    const [data, setData] = useState({});
    const [selectRename, setSelectRename] = useState(false)
    const [renameValue, setRenameValue] = useState("")
    const [selectItemById, setSelectItemById] = useState({})
    const [isChecked, setIsChecked] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);


    const fetchAllContent = async () => {
        setIsChecked(false)
        try {
            const response = await fetch('http://localhost:3000/view-all-content');
            const result = await response.json();
            setData(result); // Update the state with the fetched data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchAllContent()
    }, [])



    const updateContentHandler = async () => {
       
        const updatedData={
            updated_by:selectItemById.updated_by,
            mimetype:selectItemById.mimetype,
            name:renameValue,
        }
       
        const apiUrl = `http://localhost:3000/edit-content/${selectItemById.id}`
        axios.patch(apiUrl,updatedData)
        .then(response=>{
            fetchAllContent()
            setSelectedItem(false)
            setSelectRename(false)
            setShowSuccessBanner(true);
            
            setTimeout(() => {
                setShowSuccessBanner(false);
              }, 2000);

            console.log("COntent updated successflyyu" , response.data);
        })
        .catch(error=>(
            console.log(error)
        ))
    };

    return (
        <GlobalContext.Provider value={{showSuccessBanner , isChecked,setIsChecked, updateContentHandler,selectItemById, setSelectItemById, renameValue, setRenameValue, selectedItem, setSelectedItem, theme, setTheme, data, setData, selectRename, setSelectRename }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;
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

     const fetchAllContent =async()=>{
        const apiUrl='http://localhost:3000/view-all-content';
        axios.get(apiUrl)
        .then(response=>{
            setData(response.data)
        })
        .catch(error=>{
            console.log(error)
        })

     }

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
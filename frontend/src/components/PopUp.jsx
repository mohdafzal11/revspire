import React  , {useState , useContext} from 'react'
import GlobalContext from './context/GlobalContext'

const PopUp = () => {
    const {updateContentHandler,renameValue , setRenameValue  , setSelectRename}=useContext(GlobalContext);

    function renameHandler (e){   
        setRenameValue(e.target.value)
    }

    function cancelHandler(){
        setSelectRename(false)
    }
    return (
        <div>
            <div className='fixed bg-white top-1/3 left-1/3  h-[200px] w-[275px] rounded-lg border-slate-200 border-2	'>
                <h1 className='ml-[15px] mt-[5px] font-bold'>Rename</h1>
                <h1 className='ml-[15px] mt-[25px]'>Name:</h1>
                <input className="pl-[5px] w-[240px] mt-[20px] rounded-md border-slate-400	 border-2 ml-[15px]" type="text" vlaue={renameValue} onChange={renameHandler}/>
                <div className='flex justify-center'>
                    <button onClick={cancelHandler} className='bg-pink-300 rounded-xl mx-[20px] border-slate-400 px-[15px] border-2 mt-[20px] w-[100px]'>Cancel</button>
                    <button onClick={updateContentHandler} className=' rounded-xl mx-[20px]  border-slate-400 px-[15px] border-2 mt-[20px] w-[100px]'>Save</button>
                </div>
            </div>
        </div>
    )
}

export default PopUp
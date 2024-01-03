import React, { useContext } from 'react'
import GlobalContext from './context/GlobalContext'
import { contentData } from '../assets/data'
import PopUp from './PopUp'
import './Content.css'


const Content = () => {

  const { showSuccessBanner, data, setSelectItemById, setShowRenameButton, showRenamePopup } = useContext(GlobalContext)
  function findName(id) {
    for (let i = 0; i < contentData.length; i++) {
      if (id === contentData[i].id) {
        return contentData[i].name;
      }

    }
  }
  const checkboxButtonHandler = (e, item) => {
    if (e.target.checked) {
      setSelectItemById(item)
      setShowRenameButton(true)
    }
    else {
      setShowRenameButton(false)
      setSelectItemById({})
    }
  }

  return (
    <div className='main-container'>
      <div className='heading-container'>
        <h3 className='w-[20px]'></h3>
        <h3>Name</h3>
        <h3>Source</h3>
        <h3>Created By </h3>
        <h3>Created Date</h3>
        <h3>Modified By</h3>
        <h3>Modified Date</h3>
        <h3>Size</h3>
      </div>
      {  showSuccessBanner && <div className='fixed right-0 mr-[20px] px-[20px] py-[20px] rounded-lg border-2	 '>
         <span className='mr-[20px] text-green-700 border-2 border-green-900 px-[12px] py-[8px] rounded-full'>&#10004;</span>Rename Successful
      </div>}
      {showRenamePopup && <PopUp></PopUp>}
      <div>
        {
          Array.isArray(data.content) && data.content.map(item => (
            <ul key={item.id}>
              <div className='item-container cursor-pointrer'>
                <p className='mr-[10px] '><input type="checkbox" className="checkbox-round" onClick={(e) => { checkboxButtonHandler(e, item) }} /></p>
                <p className='w-[200px] '>{item.name.substring(-1, 20)}</p>
                <p className='w-[200px] '>{item.source}</p>
                <p className='w-[200px] '>{findName(item.created_by)}</p>
                <p className='w-[200px] '>{item.created_at.slice(8, 10) + '/' + item.created_at.slice(5, 7) + '/' + item.created_at.slice(0, 4)}</p>
                <p className='w-[200px] '>{findName(item.updated_by)}</p>
                <p className='w-[200px] '>{item.updated_at.slice(8, 10) + '/' + item.updated_at.slice(5, 7) + '/' + item.updated_at.slice(0, 4)}</p>
                <p className='w-[200px] '>2 Mb ⓘ</p>
              </div>
            </ul>
          ))}
      </div>
    </div>
  )
}

export default Content
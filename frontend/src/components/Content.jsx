import React, { useContext } from 'react'
import GlobalContext from './context/GlobalContext'
import { contentData } from '../assets/data'
import PopUp from './PopUp'
import './Content.css'


const Content = () => {

  const { getTableNameHandler, data, setSelectItemById, setShowRenameButton, showRenamePopup } = useContext(GlobalContext)

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
    <div className='main-container mt-[-11px]'>

      {showRenamePopup && <PopUp></PopUp>}
      <div>
        {
          Array.isArray(data.content) && data.content.map(item => (
            <ul key={item.id}>
              <div className='item-container cursor-pointrer'>
                <p className='mr-[10px] '><input type="checkbox" className="checkbox-round" onClick={(e) => { checkboxButtonHandler(e, item) }} /></p>
                <p className='w-[220px] flex relative '>
                  <p>{item.name.substring(-1, 20)}</p>
                  <p className='text-white border-2 border-slate-200 absolute right-10 px-[10px] rounded-full bg-blue-600'>+</p>
                </p>
                <p className='w-[220px] '>{item.source}</p>
                <p className='w-[220px] '>{findName(item.created_by)}</p>
                <p className='w-[220px] '>{item.created_at.slice(8, 10) + '/' + item.created_at.slice(5, 7) + '/' + item.created_at.slice(0, 4)}</p>
                <p className='w-[220px] '>{findName(item.updated_by)}</p>
                <p className='w-[220px] '>{item.updated_at.slice(8, 10) + '/' + item.updated_at.slice(5, 7) + '/' + item.updated_at.slice(0, 4)}</p>
                <p className='w-[220px] '>2 Mb ⓘ</p>
              </div>
            </ul>
          ))}
      </div>
    </div>
  )
}

export default Content
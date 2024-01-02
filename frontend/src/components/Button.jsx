import React from 'react'

const Button = ({ value }) => {
    return (
        <div>
            <button className='mr-[20px] w-[100px] py-[2px] rounded-full px-[15px] border-2 border-gray-400'>{value}</button>
        </div>
    )
}

export default Button
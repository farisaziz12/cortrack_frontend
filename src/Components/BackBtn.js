import React from 'react'
import './BackBtn.css'
import { Link } from 'react-router-dom'

export default function BackBtn() {
    return (
        <div>
            <Link to='/'>
                <button className='back-btn'>Back</button>
            </Link>
        </div>
    )
}

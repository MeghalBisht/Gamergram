import React from 'react'
import "../Styles/ToggleBtn.css"

function btn () {
    document.querySelector('#toggleTheme').classList.toggle('dark-theme')
} 
function ToggleTheme() {
    return (
        <i onClick={btn} id='btn-toggle' className="material-icons ">brightness_4</i>
    )
}

export default ToggleTheme

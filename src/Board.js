import React, { useState } from 'react'

const Board = () => {
    const [sideNav, setSideNav] = useState(false)
    return (
        <div className = "board-header p-2">
            <div className = "text-left">
                <h3 className = "board-title">Kanban Board</h3>
                <span className = "board-divider"></span>
                <button className = "common-btn signup board-btn "><i className="fas fa-globe-africa"></i> &nbsp;Public</button>
                <span className = "board-divider"></span>
                <div className = "board-profile ">AH <span className="profile-icon"><i className="fas fa-angle-double-up"></i></span></div>
                <div className = "board-btns menu-items">
                    <span className = "board-divider"></span>
                    <button className = "common-btn signup board-btn "><i className="fas fa-sort-amount-up"></i> &nbsp;Filter</button>
                    <button className = "common-btn signup board-btn " onClick = {() => setSideNav(true)}><i className="fas fa-ellipsis-h"></i> &nbsp;Show menu</button>
                </div>
            </div>
            
            
        </div>
    )
}

export default Board

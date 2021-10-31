import React, { useState } from 'react'
import * as master from './shared/MasterData'
import { Container, Form, Row, Col, Card, Button } from 'react-bootstrap'

const Board = () => {
    const [sideNav, setSideNav] = useState(false)
    return (
        <div className = {`board-header p-2 ${sideNav ? 'is-side-nav-menu' : '' }`}>
            <div className = "text-left board-content">
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
            {sideNav && 
                <div className = {`side-nav ml-auto ${sideNav ? 'w-300' : ''}`}>
                    <div className="menu pb-0">
                        Menu      
                        <span className = "close-icon" onClick = {() => {setSideNav(false)}}><i class="fas fa-times"></i></span>              
                        <hr className = "board-menu-divider m-2" />

                    </div>

                    <div className = "about-board p-2">
                        <div className = "menu-items"><i className="fab fa-trello "></i>&nbsp; About this board</div>
                        <div className = "mt-2 menu-items"><i className="fas fa-ellipsis-h"></i>&nbsp; More</div>
                    </div>
                    <hr className = "board-menu-divider" />
                    <div className = "about-acitvity p-2">
                        <div className = "acitvity  menu-items">
                            <i className="fas fa-list-ul"></i>&nbsp; Activity
                        </div>
                    </div>
                    <div className = " p-2">
                        {master.activityData.map((item, ind) => {
                            return (
                                <div className = "acitvity-content mb-4">
                                    <Row>
                                        <Col md= {2} xs = {2}>

                                            <div className = "board-profile ">AH </div>
                                        </Col>
                                        <Col md= {10} xs = {10}>

                                            <span><span className="profile-name">{item.name} </span>{item.content}</span>
                                            <div className="profile-date">{item.date}</div>
                                        </Col>
                                    </Row>
                                   

                                </div>
                            )
                        })}
                    </div>

                </div>
            }
            
            
        </div>
    )
}

export default Board

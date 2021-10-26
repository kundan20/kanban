import React, { useState, useEffect, useRef } from 'react'
import { Container, Form, Row, Col, Card, Button } from 'react-bootstrap'
import * as constants from './shared/Constants'
import * as master from './shared/MasterData'
import Modal from 'react-awesome-modal'
import Column from './Column'
import { DragDropContext } from 'react-beautiful-dnd'
import {CommonService} from './shared/CommonService'
import Header from './shared/Header'
import BannerHeader from './BannerHeader'
import Board from './Board'
const cs = new CommonService()

const TrelloDashboard = () => {
    const [ formData, setFormData ] = useState({})
    const [ errorsData, setErrorsData ] = useState({})
    const [ peopleData, setPeopleData ] = useState()
    const [ planetData, setPlanetData ] = useState()

    const [ searchVal, setSearchVal ] = useState()

    const [isList, setIsList ] = useState(false)
    const [isItem, setIsItem ] = useState(false)
    const [initialData, setInitalData ] = useState(master.initialData)
    const hasMount = useRef(false)
    const [isChange, setIsChange ] = useState(false)


    useEffect(() => {
            let initialData = JSON.parse(localStorage.getItem('initialData'))
            if(initialData === null ) {
                localStorage.setItem('initialData', JSON.stringify(master.initialData))
                setInitalData(master.initialData)
            } else {
                setInitalData(initialData)
            }       
    }, [])

    const setValue = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
        if(!!errorsData[e.target.name]) {
            setErrorsData({
                ...errorsData,
                [e.target.name] : null
            })
        }
    }

    const setSearchValue = (e) => {
        
        let initialData = JSON.parse(localStorage.getItem('initialData'));

        const filtered = Object.fromEntries(Object.entries(initialData.tasks).filter(([task, taskVal]) => 
            taskVal.status.toLowerCase().includes(e.target.value.toLowerCase()) || 
            taskVal.title.toLowerCase().includes(e.target.value.toLowerCase())))
        
        initialData.tasks = filtered

        if(Object.keys(filtered).length > 0) {
            Object.fromEntries(Object.entries(initialData.columns).filter(([col, colVal]) => {
                    const temp = []
                    for (const [key] of Object.entries(filtered)) {
                        colVal.taskIds.map((taskId) => {
                            if(taskId === key) {
                                temp.push(taskId)                            
                            }
                        })
                    }
                    colVal.taskIds = temp;
                } 
            ))
        }
        if(Object.keys(initialData.tasks).length > 0) {
            setInitalData(initialData)
        }

        // cs.getPeople(e.target.value).then((res) => {
        //     console.log('getPeople res--', res)
        //     if(res && res.results) {
        //         setPeopleData(res.results)
        //     }
        // }).catch((err) => {
        //     console.log('Something went wrong ', err)
        // })
        // cs.getPlanet(e.target.value).then((res) => {
        //     console.log('getPlanet res--', res)
        //     if(res && res.results) {
        //         setPlanetData(res.results)
        //     }
        // }).catch((err) => {
        //     console.log('Something went wrong ', err)
        // })
    }
 

    const reRenderHandler = () => {
        let initialData = JSON.parse(localStorage.getItem('initialData'))
        setInitalData(initialData)
    }

    const errorFormsHandler = () => {
        const { title } = formData
        const errorsObj = {}        
        if ( !title || title === '' ) errorsObj.title = 'Title ' + constants.CANT_BLANK
        return errorsObj
    }

    const addListHandler = () => {
        setIsList(true)
    }

    const addItemsHandler = (isItem, colId) => {
        setIsItem(isItem)
        // console.log('isItem, colId ',isItem, colId)
    }

    const closeModal = () => {
        setIsList(false)
        setIsItem(false)
    }

    const formHandler = (e) => {
        e.preventDefault()
        const errorsObj = errorFormsHandler()
        if(Object.keys(errorsObj).length > 0) {
         setErrorsData(errorsObj)
        } else {
            let initialData = JSON.parse(localStorage.getItem('initialData'))
            let l = initialData.columnOrder.length
            let temp = initialData.columnOrder[l-1]
            let lastColInd = parseInt(temp.split('-')[1])
            let newColId = 'column-'+ (lastColInd + 1)
            const newObj = {
                id: newColId,
                title: formData.title,
                taskIds: []
            }
            let newColOrder = [...initialData.columnOrder]
            newColOrder.push(newObj.id)
            let newState = {
                ...initialData,
                columns: {
                    ...initialData.columns,
                    [newColId]: newObj
                },
                columnOrder: newColOrder
            }
            setInitalData(newState)
            localStorage.setItem('initialData', JSON.stringify(newState))
            setIsList(false)
        }
    }

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result
        if(!destination) return;
        if(
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        const start = initialData.columns[source.droppableId]
        const finish = initialData.columns[destination.droppableId]
        if(start === finish) {
            const newTaskIds = Array.from(start.taskIds)
            newTaskIds.splice(source.index, 1)
            newTaskIds.splice(destination.index, 0, draggableId)
            // console.log('newTaskIds--', newTaskIds)
            const newColumn = {
                ...start,
                taskIds: newTaskIds
            }
            const newState = {
                ...initialData,
                columns: {
                    ...initialData.columns,
                    [newColumn.id]: newColumn
                }
            }
            setInitalData(newState)
            localStorage.setItem('initialData', JSON.stringify(newState))
            return;
        }
        //movement of task from one list to another
        const startTaskIds = Array.from(start.taskIds)
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds
        }
        const finishTaskIds = Array.from(finish.taskIds)
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds
        }
        // console.log('new Finish ', newFinish)
        // console.log('new initialData ', initialData)

        const destTaskIds = newFinish.taskIds
        const destTasks = destTaskIds.map(item => initialData.tasks[item])
        // console.log('new destTasks ', destTasks)
        const newFinishTaskIds = []
        const sortedDestTasks = destTasks.sort((a, b) => {
            return new Date(b.creationTime) - new Date(a.creationTime)
        })
        // console.log('new sortedDestTasks ', sortedDestTasks)
        sortedDestTasks.forEach((item) => {
            newFinishTaskIds.push(item.id)
        })
        // console.log('new newFinishTaskIds ', newFinishTaskIds)

        newFinish.taskIds = newFinishTaskIds

        const newState = {
            ...initialData,
            columns: {
                ...initialData.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            }
        }
        setInitalData(newState)
        localStorage.setItem('initialData', JSON.stringify(newState))
    }

    return (
        <div className = "bg-blue">
            <Header />
            <BannerHeader />
            <Board />
            <div className="d-sm-none d-block"> <br/><br/></div>
           
            <Container className = "p-0 m-0 m-2">
                <Row className = "mt-2">                    
                    <Col md={4} >
                        <div className="search-icons ">
                            <i className="fa fa-search icon"></i>
                            <input 
                                type= "text" 
                                className = "serach-bar form-control" 
                                placeholder = "Search by name / status..."
                                name = "searchVal" 
                                value = {searchVal} 
                                onChange = {setSearchValue}
                            />
                            
                        </div> 

                    </Col>
                    <Col md={4}>
                        <button className = "common-btn signup board-btn add-list-btn" onClick = {addListHandler}>{constants.ADD_LIST}</button>
                    </Col>
                </Row>
            </Container>
            <Container className = " overflow-hidden bg-sky pb-4 ">
                <Row  className = "mt-1"> 
                    <DragDropContext onDragEnd = {onDragEnd}>                    
                        {initialData !== undefined && initialData.columnOrder.map((list, ind) => {
                            const column = initialData.columns[list]
                            const tasks = column.taskIds.length !== 0 && column.taskIds.map((taskId, taskInd) =>  initialData.tasks[taskId])                            
                            return (
                                <Column key = {column.id} column = {column} tasks = {tasks} onChange = {() => addItemsHandler()} reRenderHandler = {reRenderHandler}  index = {ind}/>
                            )
                        })}
                    </DragDropContext>
                </Row>
                <Modal visible={ isList || isItem } width="400" height= {`300`} effect="fadeInUp" >
                    <div className = "forms">
                        <Row>
                            <Col className = "text-center mb-4">
                                <h4>Add List</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form onSubmit = {formHandler}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter title" 
                                            name = "title" 
                                            value = {formData.title} 
                                            onChange = {setValue} 
                                            isInvalid = {!!errorsData.title}
                                        />
                                        <Form.Control.Feedback type='invalid' >
                                            { errorsData.title }
                                        </Form.Control.Feedback>                            
                                    </Form.Group>
                                   
                                    <div className = "text-center mt-4">
                                        <Button className = "trello-btn " type="submit">
                                            Submit
                                        </Button>
                                        <Button className = "trello-btn cancel" onClick = {closeModal}>
                                            Cancel
                                        </Button>
                                    </div>
                                
                                </Form>

                            </Col>
                        </Row>
                    </div>
                </Modal>
            </Container>
        </div>

    )
}

export default TrelloDashboard

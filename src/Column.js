import React, { useState, useEffect } from 'react'
import { Container, Form, Row, Col, Card, Button } from 'react-bootstrap'
import { Droppable } from 'react-beautiful-dnd'
import Task from './Task'
import * as constants from './shared/Constants'
import * as master from './shared/MasterData'
import Modal from 'react-awesome-modal'
import moment from 'moment'

const InnerList = props => {
    const { tasks, colId, taskRenderHandler } = props
    return (
        <>
            {tasks && tasks.map((item, index) => {
                return <Task key = {item.id} item = {item} index = {index} colId = {colId} taskRenderHandler = {taskRenderHandler}/> 
            })}
        </>
    )
}
const MemoInnerList = React.memo(InnerList)

const Column = props => {
    const [ formData, setFormData ] = useState({})
    const [ errorsData, setErrorsData ] = useState({})
    const [isItem, setIsItem ] = useState(false)
    const [initialData, setInitalData ] = useState(master.initialData)
    const [currentCol, setCurrentCol ] = useState()

    const { column, tasks, index } = props

   console.log('props col ', props)

    const closeModal = () => {
        setIsItem(false)
    }

    const addItemHandler = (colId) => {
        setIsItem(true)
        setCurrentCol(colId)

    }
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

    const errorFormsHandler = () => {
        const { title, desc } = formData
        const errorsObj = {}        
        if ( !title || title === '' ) errorsObj.title = 'Title ' + constants.CANT_BLANK
        if ( !desc || desc === '' ) errorsObj.desc = 'Description ' + constants.CANT_BLANK
        return errorsObj
    }

    const deleteListHandler = (currentColId, currentColIndex) => {
        let initialData = JSON.parse(localStorage.getItem('initialData'))
        if(initialData === null ) {
            localStorage.setItem('initialData', JSON.stringify(master.initialData))
        } else {
            console.log('initialData  deleteListHandler currentColId', initialData, currentColId)

            let newColOrder = [...initialData.columnOrder]
            console.log('newColOrder before', newColOrder)

            newColOrder.splice(currentColIndex, 1)
            console.log(newColOrder)
            let tempColms = {...initialData.columns}
            console.log('tempColms ', tempColms)
            delete tempColms[currentColId]

            let newState = {
                ...initialData,
                columns: tempColms,
                columnOrder: newColOrder
            }
            console.log('newState after', newState)
            localStorage.setItem('initialData', JSON.stringify(newState))
            props.reRenderHandler()

        } 

    }
    const taskRenderHandler = () => {
        props.reRenderHandler()
    }

    const formHandler = (e) => {
        e.preventDefault()
        const errorsObj = errorFormsHandler()
        if(Object.keys(errorsObj).length > 0) {
         setErrorsData(errorsObj)
        } else {
            let initialData = JSON.parse(localStorage.getItem('initialData'))
            let objLen = Object.keys(initialData.tasks).length
            let temp = Object.keys(initialData.tasks)[objLen-1]
            let lastColInd = parseInt(temp.split('-')[1])
            let newTaskId = 'task-'+ (lastColInd + 1)
            const newObj = {
                id: newTaskId,
                title: formData.title,
                content: formData.desc,
                creationTime: moment(new Date()).format('DD/MM/YYYY, HH:mm:ss')
            }
            let colObjs = {...initialData.columns}
            let currentColObj = colObjs[currentCol]
            let newColTaskIds = [...currentColObj.taskIds]
            newColTaskIds.push(newTaskId)
            initialData.columns[currentCol].taskIds = newColTaskIds
            let newState = {
                ...initialData,
                tasks: {
                    ...initialData.tasks,
                    [newTaskId]: newObj
                },
                columns: colObjs
            }
            setInitalData(newState)
            localStorage.setItem('initialData', JSON.stringify(newState))
            setIsItem(false)
            props.reRenderHandler()
        }
    }
    return (
        <Col md = {3} className = "mt-4">
            <Card className = "parents-card">
                <Card.Header className = "list ">
                    <Row > 
                        <Col>
                            <div className = "list-title">{column.title}</div>
                        </Col>
                        <Col>
                            <div className ="close-icon" onClick = {() => deleteListHandler(column.id, index)}><i className="fas fa-times "></i></div>
                        </Col>
                    </Row>                           
                </Card.Header>
                <Droppable droppableId = {column.id}>
                    {(provided, snapshot) => (
                        <Card.Body 
                            className = "ht-child"
                            ref = {provided.innerRef}
                            {...provided.droppableProps}
                        >
                             {/* <InnerList tasks = {tasks} /> */}

                            <MemoInnerList tasks = {tasks} colId = {column.id} taskRenderHandler= {taskRenderHandler} />
                           
                            {provided.placeholder}
                        </Card.Body > 
                    )}
                </Droppable>
            
                <div className = "add-items" onClick = {() => addItemHandler(column.id)}>
                    <i className="fas fa-plus-circle plus-icon cur-ptr"></i>
                </div>

            </Card>         

             <Modal visible={ isItem } width="400" height= {`400`} effect="fadeInUp" >
                <div className = "forms">
                    <Row>
                        <Col className = "text-center mb-4">
                            <h4>Add Items</h4>
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
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Enter description" 
                                        name = "desc" 
                                        value = {formData.desc} 
                                        onChange = {setValue} 
                                        isInvalid = {!!errorsData.desc}
                                    />
                                    <Form.Control.Feedback type='invalid' >
                                        { errorsData.desc }
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
        </Col>
    )
}

export default Column

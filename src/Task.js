import React, {useRef} from 'react'
import { Container, Form, Row, Col, Card, Button } from 'react-bootstrap'
import { Draggable } from 'react-beautiful-dnd'
// import * as moment from 'moment'
const Task = (props) => {
    const { item, index, colId, taskRenderHandler } = props
    // console.log('Task comp')
    const deleteItemHandler = (itemId) => {
        // console.log('props Task itemId colId', itemId, colId)
        let initialData = JSON.parse(localStorage.getItem('initialData'))
        let currentTasksObj = {...initialData.tasks}
        delete currentTasksObj[itemId]
        // console.log('currentTasksObj ', currentTasksObj)
        let colObjs = {...initialData.columns}
        // console.log('colObjs-', colObjs)

        let currentColObj = colObjs[colId]
        let colTaskIds = [...currentColObj.taskIds]
        const newColTaskIds = colTaskIds.filter(task => {
            return task !== itemId
        })
        // console.log('newColTaskIds-', newColTaskIds)

        initialData.columns[colId].taskIds = newColTaskIds

        let newState = {
            ...initialData,
            tasks: currentTasksObj,
            columns: colObjs
        }
        // console.log('newState  after deleting task-', newState)
        localStorage.setItem('initialData', JSON.stringify(newState))
        taskRenderHandler()

    }
    return (

        <Draggable draggableId = {item.id} index = {index}>
            {(provided, snapshot) => (
                <div 
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref = {provided.innerRef}
                >
                    <Card key={item.id} className = {`mb-3 task-card`}>
                        <Card.Header>
                            <Row className = "list "> 
                                <Col>
                                    <div className = "list-title">{item.title} <span className={`item-status ${item.status === 'DONE' ? 'done' : item.status === 'WIP' ? 'wip' : 'rejected'}`}>{item.status}</span></div>
                                </Col>
                                <Col>
                                    <div className ="close-icon" onClick = {() => deleteItemHandler(item.id)}><i className="fas fa-times "></i></div>
                                </Col>
                            </Row>                           
                        </Card.Header>
                        <Card.Body>
                            <div className = "item-desc">
                                {item.content}
                            </div>
                            <div className = "date-time">
                                {/* <em>{moment(item.creationTime).format('DD/MM/YYYY, HH:mm:ss')}</em> */}

                                <em>{item.creationTime}</em>
                            </div>
                        </Card.Body>
                    </Card>
        

                </div>
            )}
            
        </Draggable>
    )
}

export default React.memo(Task)

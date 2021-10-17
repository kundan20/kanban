export const initialData = {
    tasks: {
        'task-1': {
            id: 'task-1',
            title: 'Product',
            content: '3 Pending task to be picked by Jui',
            creationTime: '10/09/2021, 22:13:24'
        },
        'task-2': {
            id: 'task-2',
            title: 'Sales',
            content: 'Send proposals to Puneet for sale prices',
            creationTime: '10/09/2021, 11:13:24'
        },
        'task-3': {
            id: 'task-3',
            title: 'Service',
            content: 'Service task to be picked by Akku',
            creationTime: '05/09/2021, 04:13:24'
        },
        'task-4': {
            id: 'task-4',
            title: 'UAT Testing',
            content: 'Ask engineers to set up testing infra',
            creationTime: '01/09/2021, 08:13:24'
        }
    },
    columns: {
        'column-1' : {
            id: 'column-1',
            title: 'Teams',
            taskIds: ['task-1', 'task-2', 'task-3' ]
        },
        'column-2' : {
            id: 'column-2',
            title: 'Products',
            taskIds: ['task-4']
        }
    },
    columnOrder: ['column-1', 'column-2']
}
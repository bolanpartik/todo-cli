const fs = require('fs')
const { Command } = require('commander')
const program = new Command()

const saveTask = (tasks, message) => {
    fs.writeFile('todo.json', JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log(message)
        }
    })
}

const addTask = (task) => {

    fs.readFile('todo.json', 'utf-8', (err, todo) => {

        if (err) {
            console.log('Error occured', err)
            return
        }

        let tasks=[]
        if(todo){
            tasks = JSON.parse(todo)
        }

        const nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1
        const newTask = { "id": nextId, "task": task }
        tasks.push(newTask)
        saveTask(tasks, 'Task added')
    })
}

const deleteTask = (todoName) => {

    fs.readFile('todo.json', 'utf-8', (err, todo) => {

        if(err){
            console.log(err)
            return
        }

        const tasks = JSON.parse(todo);
        const pendingTask = tasks.filter(task => task.task !== todoName)
        saveTask(pendingTask, 'Task deleted')
    })
}

const updateTask = (oldTask, newTask) => {
    fs.readFile('todo.json', 'utf-8', (err, todo) => {

        if(err){
            console.log(err)
            return
        }

        const todos = JSON.parse(todo)
        const updateTodo = todos.map(task => {
            if (task.task === oldTask) {
                return { id: task.id, task: newTask }
            }
            return task
        })
        saveTask(updateTodo, 'Update done')
    })
}

program
    .name('Todo Manager')
    .description('Manage your tasks')
    .version('1.0.0')

program
    .command('add')
    .description('add todo')
    .argument('string', 'todo name')
    .action((data) => {
        addTask(data)
    })

program
    .command('delete')
    .description('delete todo')
    .argument('string', 'todo name')
    .action((data) => {
        deleteTask(data)
    })

program
    .command('update')
    .description('udpate todo')
    .argument('string', 'todo to be update')
    .argument('string', 'updated todo')
    .action((oldTask, newTask) => {
        updateTask(oldTask, newTask)

    })

program
    .command('list')
    .description('list all todo')
    .action(() => {
        fs.readFile('todo.json', 'utf-8', (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            const tasks = JSON.parse(data)
            tasks.forEach(task => {
                console.log(`${task.id} ${task.task}`)
            })
        })
    })
    

program.parse()
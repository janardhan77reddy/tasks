const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const process = require('process');
const port = process.env.PORT || 3000;




let tasks = [];
let taskId = 1;

app.post('/v1/tasks', (req, res) =>{
    const newTask = {
        id: taskId++,
        title: req.body.title,
        is_completed: false
    };
    tasks.push(newTask);
    res.status(201).json({ id: newTask.id });
});

app.get('/v1/tasks', (req, res) => {
    const tasks = db.getALLTasks();
    const response = {
        tasks: tasks.map(task => ({
            id: task.id,
            title: task.title,
            is_completed: task.isCompleted
        }))
    };
    res.status(200).json(response);
});

app.get('/v1/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find((t) =>t.id === taskId);
    if(!task){
        return res.status(404).json({ error: 'There is no task at that id'});
    }
    return res.status(200).json(task);
});

app.delete('/v1/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if(taskIndex === -1){
        return res.status(204).send();
    }
    tasks.splice(taskIndex, 1);
    return res.status(204).send();
});

app.put('/v1/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);

    if(!task){
        return res.status(404).json({error: "Threre is no task at that id"});
    }
    task.title = req.body.title || task.title;
    task.is_completed = req.body.is_completed || task.is_completed;


    return res.status(204).end();
});

let lastId = 2;

app.post('/v1/tasks', (req, res) => {
    const taskData = req.body.tasks;
    const newTasks = [];
    taskData.forEach(data => {
        const newTask = {
            id: ++lastId,
            title: data.title,
            is_completed: data.is_completed || false
        };
        tasks.push(newTask);
        newTasks.push({id: newTask.id});
    });
    res.status(201).json({ tasks: newTasks});
});

app.delete('/v1/tasks', (req, res) => {
    const taskIds = req.body.tasks.map((task) => task.id);
    let deletedCount = 0;
    taskIds.forEach((id) => {
        const index = tasks.findIndex((task) => task.id === id);
        if(index >= 0){
            tasks.splice(index, 1);
            deletedCount++;
        }
    });
    if(deletedCount === 0){
        return res.status(404).json({ error: 'NO task were deleted'});
    }
    return res.status(204).send();
});





app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('welcome to the task api');
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
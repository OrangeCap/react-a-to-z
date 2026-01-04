import {useReducer} from 'react';

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];

export default function ToDo(){
    const[tasks, dispatch] = useReducer(tasksReducer, initialTasks);

    function handleAddTask(text){
        dispatch({
            type: "add",
            id: nextId++,
            text: text,
        })
    }
    function handleChangeTask(task){
        dispatch({
            type: "edit",
            task: task,
        })
    }
    function handleDeleteTask(taskId){
        dispatch({
            type: "remove",
            id: taskId,
        })
    }
    return (
        <>
          <h1>Prague itinerary</h1>
          <AddTask onAddTask={handleAddTask} />
          <TaskList
            tasks={tasks}
            onChangeTask={handleChangeTask}
            onDeleteTask={handleDeleteTask}
          />
        </>
      );
}
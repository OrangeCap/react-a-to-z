/*
Components with many state updates spread across many event handlers can get overwhelming. For these cases, you can 
consolidate all the state update logic outside your component in a single function, called a reducer.
*/

//----------------------------Consolidate state logic with a reducer-----------------------------------------------
/*
As your components grow in complexity, it can get harder to see at a glance all the different ways in which a component’s 
state gets updated. For example, the TaskApp component below holds an array of tasks in state and uses three different 
event handlers to add, remove, and edit tasks:
*/
import { useState } from "react";
import AddTask from "./AddTask.js";
import TaskList from "./TaskList.js";

let nextId = 3;
const initialTasks = [
  { id: 0, text: "Visit Kafka Museum", done: true },
  { id: 1, text: "Watch a puppet show", done: false },
  { id: 2, text: "Lennon Wall pic", done: false },
];

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
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

/*
Each of its event handlers calls setTasks in order to update the state. As this component grows, so does the amount of 
state logic sprinkled throughout it. To reduce this complexity and keep all your logic in one easy-to-access place, you 
can move that state logic into a single function outside your component, called a “reducer”.

Reducers are a different way to handle state. You can migrate from useState to useReducer in three steps:
1. Move from setting state to dispatching actions.
2. Write a reducer function.
3. Use the reducer from your component.
*/

// Step 1: Move from setting state to dispatching actions

// Your event handlers currently specify what to do by setting state:

function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
/*
Managing state with reducers is slightly different from directly setting state. Instead of telling React “what to do” by s
etting state, you specify “what the user just did” by dispatching “actions” from your event handlers. (The state update 
logic will live elsewhere!) So instead of “setting tasks” via an event handler, you’re dispatching an 
“added/changed/deleted a task” action. This is more descriptive of the user’s intent.
*/

function handleAddTask(text) {
  dispatch({
    type: "added",
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: "changed",
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: "deleted",
    id: taskId,
  });
}
// The object you pass to dispatch is called an “action”:

/*
The object you pass to dispatch is called an “action”:

function handleDeleteTask(taskId) {
  dispatch(
    // "action" object:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
It is a regular JavaScript object. You decide what to put in it, but generally it should contain the minimal information 
about what happened. (You will add the dispatch function itself in a later step.)

Note
An action object can have any shape.

By convention, it is common to give it a string type that describes what happened, and pass any additional information in 
other fields. The type is specific to a component, so in this example either 'added' or 'added_task' would be fine.

Choose a name that says what happened!
dispatch({
  // specific to component
  type: 'what_happened',
  // other fields go here
});
*/

// Step 2: Write a reducer function
/*
A reducer function is where you will put your state logic. It takes two arguments, the current state and the action 
object, and it returns the next state:

function yourReducer(state, action) {
  // return next state for React to set
}
React will set the state to what you return from the reducer.

To move your state setting logic from your event handlers to a reducer function in this example, you will:
1. Declare the current state (tasks) as the first argument.
2. Declare the action object as the second argument.
3. Return the next state from the reducer (which React will set the state to).
*/

// Here is all the state setting logic migrated to a reducer function:
function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case "changed": {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case "deleted": {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

/*
DEEP DIVE:

Why are reducers called this way?
Although reducers can “reduce” the amount of code inside your component, they are actually named after the reduce() 
operation that you can perform on arrays.
The function you pass to reduce is known as a “reducer”. It takes the result so far and the current item, then it returns 
the next result. React reducers are an example of the same idea: they take the state so far and the action, and return the 
next state. In this way, they accumulate actions over time into state.
*/

// Step 3: Use the reducer from your component 
/*
Finally, you need to hook up the tasksReducer to your component. Import the useReducer Hook from React:
import { useReducer } from 'react';

Then you can replace useState:
const [tasks, setTasks] = useState(initialTasks);

with useReducer like so:
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

The useReducer Hook is similar to useState—you must pass it an initial state and it returns a stateful value and a way to 
set state (in this case, the dispatch function). But it’s a little different.

The useReducer Hook takes two arguments:
1. A reducer function
2. An initial state

And it returns:
1. A stateful value
2. A dispatch function (to “dispatch” user actions to the reducer)

Component logic can be easier to read when you separate concerns like this. Now the event handlers only specify what 
happened by dispatching actions, and the reducer function determines how the state updates in response to them.
*/

//--------------------------------------Comparing useState and useReducer-------------------------------------------
/*
Comparing useState and useReducer

Reducers are not without downsides! Here’s a few ways you can compare them:

Code size: Generally, with useState you have to write less code upfront. With useReducer, you have to write both a reducer 
    function and dispatch actions. However, useReducer can help cut down on the code if many event handlers modify state in a 
    similar way.
Readability: useState is very easy to read when the state updates are simple. When they get more complex, they can bloat 
    your component’s code and make it difficult to scan. In this case, useReducer lets you cleanly separate the how of update 
    logic from the what happened of event handlers.
Debugging: When you have a bug with useState, it can be difficult to tell where the state was set incorrectly, and why. 
    With useReducer, you can add a console log into your reducer to see every state update, and why it happened (due to which 
    action). If each action is correct, you’ll know that the mistake is in the reducer logic itself. However, you have to step 
    through more code than with useState.
Testing: A reducer is a pure function that doesn’t depend on your component. This means that you can export and test it 
    separately in isolation. While generally it’s best to test components in a more realistic environment, for complex state 
    update logic it can be useful to assert that your reducer returns a particular state for a particular initial state and 
    action.
Personal preference: Some people like reducers, others don’t. That’s okay. It’s a matter of preference. You can always 
    convert between useState and useReducer back and forth: they are equivalent!

We recommend using a reducer if you often encounter bugs due to incorrect state updates in some component, and want to 
introduce more structure to its code. You don’t have to use reducers for everything: feel free to mix and match! You can 
even useState and 
*/

//------------------------------------------Writing reducers well--------------------------------------------------
/*
Keep these two tips in mind when writing reducers:

Reducers must be pure. Similar to state updater functions, reducers run during rendering! (Actions are queued until the 
next render.) This means that reducers must be pure—same inputs always result in the same output. They should not send 
requests, schedule timeouts, or perform any side effects (operations that impact things outside the component). They 
should update objects and arrays without mutations.
Each action describes a single user interaction, even if that leads to multiple changes in the data. For example, if a 
user presses “Reset” on a form with five fields managed by a reducer, it makes more sense to dispatch one reset_form 
action rather than five separate set_field actions. If you log every action in a reducer, that log should be clear 
enough for you to reconstruct what interactions or responses happened in what order. This helps with debugging!
*/

// Recap
/*
- To convert from useState to useReducer:
1. Dispatch actions from event handlers.
2. Write a reducer function that returns the next state for a given state and action.
3. Replace useState with useReducer.
- Reducers require you to write a bit more code, but they help with debugging and testing.
- Reducers must be pure.
- Each action describes a single user interaction.
- Use Immer if you want to write reducers in a mutating style.
*/
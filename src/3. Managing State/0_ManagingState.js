/*
As your application grows, it helps to be more intentional about how your state is organized and how the data flows 
between your components. Redundant or duplicate state is a common source of bugs. In this chapter, you’ll learn how to 
structure your state well, how to keep your state update logic maintainable, and how to share state between distant 
components.
*/

//-----------------------------------Reacting to input with state-------------------------------------------
/* Note how the following code uses the status state variable to determine whether to enable or disable the submit button, 
and whether to show the success message instead.*/

import { useState } from 'react';

export default function ReactingToInputWithState() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}

//--------------------------------------Choosing the state structure---------------------------------------------
/*
Structuring state well can make a difference between a component that is pleasant to modify and debug, and one that is a 
constant source of bugs. The most important principle is that state shouldn’t contain redundant or duplicated information. 
If there’s unnecessary state, it’s easy to forget to update it, and introduce bugs!
*/

// For example, this form has a redundant fullName state variable:
export function StateStructureRedundant() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}

// You can remove it and simplify the code by calculating fullName while the component is rendering:
export default function StateStructure() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}

//---------------------------------------Sharing state between components--------------------------------------
/*
Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move 
it to their closest common parent, and then pass it down to them via props. This is known as “lifting state up”, and it’s 
one of the most common things you will do writing React code.
*/

//-------------------------------------Preserving and Resetting State--------------------------------------
/*
When you re-render a component, React needs to decide which parts of the tree to keep (and update), and which parts to 
discard or re-create from scratch. In most cases, React’s automatic behavior works well enough. By default, React preserves 
the parts of the tree that “match up” with the previously rendered component tree.
However, sometimes this is not what you want.
React lets you override the default behavior, and force a component to reset its state by passing it a different key, 
like <Chat key={email} />. This tells React that if the recipient is different, it should be considered a different Chat 
component that needs to be re-created from scratch with the new data (and UI like inputs). Now switching between the 
recipients resets the input field—even though you render the same component.
*/

export function Chat({ contact }) {
    const [text, setText] = useState('');
    return (
      <section className="chat">
        <textarea
          value={text}
          placeholder={'Chat to ' + contact.name}
          onChange={e => setText(e.target.value)}
        />
        <br />
        <button>Send to {contact.email}</button>
      </section>
    );
}

export default function ContactList({
    selectedContact,
    contacts,
    onSelect
  }) {
    return (
      <section className="contact-list">
        <ul>
          {contacts.map(contact =>
            <li key={contact.email}>
              <button onClick={() => {
                onSelect(contact);
              }}>
                {contact.name}
              </button>
            </li>
          )}
        </ul>
      </section>
    );
}
  
export function Messenger() {
    const [to, setTo] = useState(contacts[0]);
    return (
      <div>
        <ContactList
          contacts={contacts}
          selectedContact={to}
          onSelect={contact => setTo(contact)}
        />
        <Chat key={to.email} contact={to} />
      </div>
    )
}
  
const contacts = [
    { name: 'Taylor', email: 'taylor@mail.com' },
    { name: 'Alice', email: 'alice@mail.com' },
    { name: 'Bob', email: 'bob@mail.com' }
];

//---------------------------------------Extracting state logic into a reducer----------------------------------
/*
Components with many state updates spread across many event handlers can get overwhelming. For these cases, you can 
consolidate all the state update logic outside your component in a single function, called “reducer”. Your event handlers 
become concise because they only specify the user “actions”. At the bottom of the file, the reducer function specifies how 
the state should update in response to each action!
*/
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];

//-------------------------------------Passing data deeply with context------------------------------------------
/*
Passing props can become inconvenient if you need to pass some prop through many components, or if many components need 
the same information. Context lets the parent component make some information available to any component in the tree below 
it—no matter how deep it is—without passing it explicitly through props.
*/

//------------------------------- -----Scaling up with reducer and context----------------------------------------
/*
Reducers let you consolidate a component’s state update logic. Context lets you pass information deep down to other 
components. You can combine reducers and context together to manage state of a complex screen.
With this approach, a parent component with complex state manages it with a reducer. Other components anywhere deep in the 
tree can read its state via context. They can also dispatch actions to update that state.
*/
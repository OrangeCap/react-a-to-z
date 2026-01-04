/*
State is isolated between components. React keeps track of which state belongs to which component based on their place in 
the UI tree. You can control when to preserve state and when to reset it between re-renders.
*/

//---------------------------------------------The UI Tree--------------------------------------------------------
/*
Browsers use many tree structures to model UI. The DOM(https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) 
represents HTML elements, the CSSOM(https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model) does the same for 
CSS. There’s even an Accessibility tree!(https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree)

React also uses tree structures to manage and model the UI you make. React makes UI trees from your JSX. Then React DOM 
updates the browser DOM elements to match that UI tree. (React Native translates these trees into elements specific to 
mobile platforms.)
*/

//-------------------------------------State is tied to a position in the tree----------------------------------------
/*
When you give a component state, you might think the state “lives” inside the component. But the state is actually held 
inside React. React associates each piece of state it’s holding with the correct component by where that component sits 
in the UI tree.
*/
import { useState } from "react";

export function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}
/*
These are two separate counters because each is rendered at its own position in the tree. You don’t usually have to think 
about these positions to use React, but it can be useful to understand how it works.
In React, each component on the screen has fully isolated state. For example, if you render two Counter components side by 
side, each of them will get its own, independent, score and hover states.
*/

/*
React will keep the state around for as long as you render the same component at the same position. To see this, increment 
both counters, then remove the second component by unchecking “Render the second counter” checkbox, and then add it back 
by ticking it again:
*/

export function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />}
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={(e) => {
            setShowB(e.target.checked);
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}
/*
 the moment you stop rendering the second counter, its state disappears completely. That’s because when React removes a 
 component, it destroys its state.
 When you tick “Render the second counter”, a second Counter and its state are initialized from scratch (score = 0) and 
 added to the DOM.
 React preserves a component’s state for as long as it’s being rendered at its position in the UI tree. If it gets removed, 
 or a different component gets rendered at the same position, React discards its state.
*/

//------------------------Same component at the same position preserves state-------------------------------------------
/*

*/
export function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? <Counter isFancy={true} /> : <Counter isFancy={false} />}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={(e) => {
            setIsFancy(e.target.checked);
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }
  if (isFancy) {
    className += " fancy";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}
/*
When you tick or clear the checkbox, the counter state does not get reset. Whether isFancy is true or false, you always 
have a <Counter /> as the first child of the div returned from the root App component.
It’s the same component at the same position, so from React’s perspective, it’s the same counter.
*/

/*
PITFALL:
Remember that it’s the position in the UI tree—not in the JSX markup—that matters to React! This component has two return 
clauses with different <Counter /> JSX tags inside and outside the if:
*/
export function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={(e) => {
              setIsFancy(e.target.checked);
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={(e) => {
            setIsFancy(e.target.checked);
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }
  if (isFancy) {
    className += " fancy";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}
/*
You might expect the state to reset when you tick checkbox, but it doesn’t! This is because both of these <Counter /> tags 
are rendered at the same position. React doesn’t know where you place the conditions in your function. All it “sees” is the 
tree you return.
In both cases, the App component returns a <div> with <Counter /> as a first child. To React, these two counters have the 
same “address”: the first child of the first child of the root. This is how React matches them up between the previous and 
next renders, regardless of how you structure your logic.
*/

//---------------------------------Different components at the same position reset state-----------------------------
/*
Here, you switch between different component types at the same position. Initially, the first child of the <div> contained 
a Counter. But when you swapped in a p, React removed the Counter from the UI tree and destroyed its state.
*/
export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? <p>See you later!</p> : <Counter />}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={(e) => {
            setIsPaused(e.target.checked);
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}
/*
Also, when you render a different component in the same position, it resets the state of its entire subtree. To see how 
this works, increment the counter and then tick the checkbox.
*/
export default function App() {
    const [isFancy, setIsFancy] = useState(false);
    return (
      <div>
        {isFancy ? (
          <div>
            <Counter isFancy={true} /> 
          </div>
        ) : (
          <section>
            <Counter isFancy={false} />
          </section>
        )}
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  
  function Counter({ isFancy }) {
    const [score, setScore] = useState(0);
    const [hover, setHover] = useState(false);
  
    let className = 'counter';
    if (hover) {
      className += ' hover';
    }
    if (isFancy) {
      className += ' fancy';
    }
  
    return (
      <div
        className={className}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <h1>{score}</h1>
        <button onClick={() => setScore(score + 1)}>
          Add one
        </button>
      </div>
    );
  }
/*
The counter state gets reset when you click the checkbox. Although you render a Counter, the first child of the div 
changes from a div to a section. When the child div was removed from the DOM, the whole tree below it (including the 
Counter and its state) was destroyed as well.
As a rule of thumb, if you want to preserve the state between re-renders, the structure of your tree needs to “match up” 
from one render to another. If the structure is different, the state gets destroyed because React destroys state when it 
removes a component from the tree.
*/

/*
PITFALL:
This is why you should not nest component function definitions.
Here, the MyTextField component function is defined inside MyComponent:

Every time you click the button, the input state disappears! This is because a different MyTextField function is created 
for every render of MyComponent. You’re rendering a different component in the same position, so React resets all state 
below. This leads to bugs and performance problems. To avoid this problem, always declare component functions at the top 
level, and don’t nest their definitions.
*/
export function MyComponent() {
    const [counter, setCounter] = useState(0);
  
    function MyTextField() {
      const [text, setText] = useState('');
  
      return (
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      );
    }
  
    return (
      <>
        <MyTextField />
        <button onClick={() => {
          setCounter(counter + 1)
        }}>Clicked {counter} times</button>
      </>
    );
  }

//-------------------------------------Resetting state at the same position----------------------------------------
/*
By default, React preserves state of a component while it stays at the same position. Usually, this is exactly what you 
want, so it makes sense as the default behavior. But sometimes, you may want to reset a component’s state. Consider this 
app that lets two players keep track of their scores during each turn.
*/
export function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}

/*
Currently, when you change the player, the score is preserved. The two Counters appear in the same position, so React sees 
them as the same Counter whose person prop has changed.
But conceptually, in this app they should be two separate counters. They might appear in the same place in the UI, but one 
is a counter for Taylor, and another is a counter for Sarah.

There are two ways to reset state when switching between them:
1. Render components in different positions
2. Give each component an explicit identity with key
*/

// Option 1: Rendering a component in different positions
// If you want these two Counters to be independent, you can render them in two different positions.

export function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}

/*
Initially, isPlayerA is true. So the first position contains Counter state, and the second one is empty.
When you click the “Next player” button the first position clears but the second one now contains a Counter.

Each Counter’s state gets destroyed each time its removed from the DOM. This is why they reset every time you click the 
button.
This solution is convenient when you only have a few independent components rendered in the same place. In this example, 
you only have two, so it’s not a hassle to render both separately in the JSX.
*/

// Option 2: Resetting state with a key
/*
There is also another, more generic, way to reset a component’s state.

You might have seen keys when rendering lists. Keys aren’t just for lists! You can use keys to make React distinguish 
between any components. By default, React uses order within the parent (“first counter”, “second counter”) to discern 
between components. But keys let you tell React that this is not just a first counter, or a second counter, but a specific 
counter—for example, Taylor’s counter. This way, React will know Taylor’s counter wherever it appears in the tree!
*/

// In this example, the two <Counter />s don’t share state even though they appear in the same place in JSX:
export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
/*
Switching between Taylor and Sarah does not preserve the state. This is because you gave them different keys:
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}

Specifying a key tells React to use the key itself as part of the position, instead of their order within the parent. This 
is why, even though you render them in the same place in JSX, React sees them as two different counters, and so they will 
never share state. Every time a counter appears on the screen, its state is created. Every time it is removed, its state 
is destroyed. Toggling between them resets their state over and over.

NOTE:
Remember that keys are not globally unique. They only specify the position within the parent.
*/

//-----------------------------------------Resetting a form with a key-----------------------------------------------
// Resetting state with a key is particularly useful when dealing with forms.
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];

/*
DEEP DIVE
Preserving state for removed components 

In a real chat app, you’d probably want to recover the input state when the user selects the previous recipient again. 
There are a few ways to keep the state “alive” for a component that’s no longer visible:

You could render all chats instead of just the current one, but hide all the others with CSS. The chats would not get 
removed from the tree, so their local state would be preserved. This solution works great for simple UIs. But it can get 
very slow if the hidden trees are large and contain a lot of DOM nodes.
You could lift the state up and hold the pending message for each recipient in the parent component. This way, when the 
child components get removed, it doesn’t matter, because it’s the parent that keeps the important information. This is the 
most common solution.
You might also use a different source in addition to React state. For example, you probably want a message draft to persist 
even if the user accidentally closes the page. To implement this, you could have the Chat component initialize its state 
by reading from the localStorage, and save the drafts there too.
No matter which strategy you pick, a chat with Alice is conceptually distinct from a chat with Bob, so it makes sense to 
give a key to the <Chat> tree based on the current recipient.
*/

// RECAP
/*
- React keeps state for as long as the same component is rendered at the same position.
- State is not kept in JSX tags. It’s associated with the tree position in which you put that JSX.
- You can force a subtree to reset its state by giving it a different key.
- Don’t nest component definitions, or you’ll reset state by accident.
*/
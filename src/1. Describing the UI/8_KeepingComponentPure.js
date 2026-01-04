/*
Some JavaScript functions are pure. Pure functions only perform a calculation and nothing more. By strictly only writing 
your components as pure functions, you can avoid an entire class of baffling bugs and unpredictable behavior as your 
codebase grows. To get these benefits, though, there are a few rules you must follow.
*/

//--------------------------------Purity: Components as formulas----------------------------------------
/*
In computer science (and especially the world of functional programming), a pure function is a function with the 
following characteristics:
- It minds its own business. It does not change any objects or variables that existed before it was called.
- Same inputs, same output. Given the same inputs, a pure function should always return the same result.

function double(number) {
  return 2 * number;
}
In the above example, double is a pure function. If you pass it 3, it will return 6. Always.

React is designed around this concept. React assumes that every component you write is a pure function. This means that 
React components you write must always return the same JSX given the same inputs.
You could think of your components as recipes: if you follow them and don’t introduce new ingredients during the cooking 
process, you will get the same dish every time. That “dish” is the JSX that the component serves to React to render.
*/

//-----------------------------------Side Effects: (un)intended consequences----------------------------------------
/*
React’s rendering process must always be pure. Components should only return their JSX, and not change any objects or 
variables that existed before rendering—that would make them impure!

Here is a component that breaks this rule:
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
o/p:
Tea cup for guest #2
Tea cup for guest #4
Tea cup for guest #6

This component is reading and writing a guest variable declared outside of it. This means that calling this component 
multiple times will produce different JSX! And what’s more, if other components read guest, they will produce different 
JSX, too, depending on when they were rendered! That’s not predictable.

You can fix this component by passing guest as a prop instead:
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}

o/p:
Tea cup for guest #1
Tea cup for guest #2
Tea cup for guest #3

Now your component is pure, as the JSX it returns only depends on the guest prop.

In general, you should not expect your components to be rendered in any particular order. It doesn’t matter if you call 
y = 2x before or after y = 5x: both formulas will resolve independently of each other. In the same way, each component 
should only “think for itself”, and not attempt to coordinate with or depend upon others during rendering. Rendering is 
like a school exam: each component should calculate JSX on their own!

DEEP DIVE:

Detecting impure calculations with StrictMode
Although you might not have used them all yet, in React there are three kinds of inputs that you can read while 
rendering: props, state, and context. You should always treat these inputs as read-only.
When you want to change something in response to user input, you should set state instead of writing to a variable. You 
should never change preexisting variables or objects while your component is rendering.
React offers a “Strict Mode” in which it calls each component’s function twice during development. By calling the 
component functions twice, Strict Mode helps find components that break these rules.
Notice how the original example displayed “Guest #2”, “Guest #4”, and “Guest #6” instead of “Guest #1”, “Guest #2”, and 
“Guest #3”. The original function was impure, so calling it twice broke it. But the fixed pure version works even if 
the function is called twice every time. Pure functions only calculate, so calling them twice won’t change anything—just 
like calling double(2) twice doesn’t change what’s returned, and solving y = 2x twice doesn’t change what y is. Same 
inputs, same outputs. Always.
Strict Mode has no effect in production, so it won’t slow down the app for your users. To opt into Strict Mode, you can 
wrap your root component into <React.StrictMode>. Some frameworks do this by default.
*/

//---------------------------------Local mutation: Your component’s little secret--------------------------------------
/*
In the above example, the problem was that the component changed a preexisting variable while rendering. This is often 
called a “mutation” to make it sound a bit scarier. Pure functions don’t mutate variables outside of the function’s scope 
or objects that were created before the call—that makes them impure!

However, it’s completely fine to change variables and objects that you’ve just created while rendering.

In this example, you create an [] array, assign it to a cups variable, and then push a dozen cups into it:
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}

o/p:
Tea cup for guest #1
Tea cup for guest #2
Tea cup for guest #3
Tea cup for guest #4
Tea cup for guest #5
Tea cup for guest #6
Tea cup for guest #7
Tea cup for guest #8
Tea cup for guest #9
Tea cup for guest #10
Tea cup for guest #11
Tea cup for guest #12

If the cups variable or the [] array were created outside the TeaGathering function, this would be a huge problem! 
You would be changing a preexisting object by pushing items into that array.

However, it’s fine because you’ve created them during the same render, inside TeaGathering. No code outside of 
TeaGathering will ever know that this happened. This is called “local mutation”—it’s like your component’s little secret.
*/

//-------------------------------------Where you can cause side effects-----------------------------------------------
/*
While functional programming relies heavily on purity, at some point, somewhere, something has to change. That’s kind of 
the point of programming! These changes—updating the screen, starting an animation, changing the data—are called side 
effects. They’re things that happen “on the side”, not during rendering.
In React, side effects usually belong inside event handlers. Event handlers are functions that React runs when you perform 
some action—for example, when you click a button. Even though event handlers are defined inside your component, they don’t 
run during rendering! So event handlers don’t need to be pure.
If you’ve exhausted all other options and can’t find the right event handler for your side effect, you can still attach it 
to your returned JSX with a useEffect call in your component. This tells React to execute it later, after rendering, when 
side effects are allowed. However, this approach should be your last resort.
When possible, try to express your logic with rendering alone. You’ll be surprised how far this can take you!

DEEP DIVE:
Why does React care about purity? 

Writing pure functions takes some habit and discipline. But it also unlocks marvelous opportunities:

Your components could run in a different environment—for example, on the server! Since they return the same result for the 
same inputs, one component can serve many user requests.
You can improve performance by skipping rendering components whose inputs have not changed. This is safe because pure 
functions always return the same results, so they are safe to cache.
If some data changes in the middle of rendering a deep component tree, React can restart rendering without wasting time to 
finish the outdated render. Purity makes it safe to stop calculating at any time.
Every new React feature we’re building takes advantage of purity. From data fetching to animations to performance, 
keeping components pure unlocks the power of the React paradigm.
*/

//RECAP
/*
- A component must be pure, meaning:
  It minds its own business. It should not change any objects or variables that existed before rendering.
  Same inputs, same output. Given the same inputs, a component should always return the same JSX.
- Rendering can happen at any time, so components should not depend on each others’ rendering sequence.
- You should not mutate any of the inputs that your components use for rendering. That includes props, state, and context. 
  To update the screen, “set” state instead of mutating preexisting objects.
- Strive to express your component’s logic in the JSX you return. When you need to “change things”, you’ll usually want 
  to do it in an event handler. As a last resort, you can useEffect.
- Writing pure functions takes a bit of practice, but it unlocks the power of React’s paradigm.
*/

//----------------------------Challenge : Fix a broken story tray--------------------------------------
/*
The CEO of your company is asking you to add “stories” to your online clock app, and you can’t say no. You’ve written a 
StoryTray component that accepts a list of stories, followed by a “Create Story” placeholder.
You implemented the “Create Story” placeholder by pushing one more fake story at the end of the stories array that you 
receive as a prop. But for some reason, “Create Story” appears more than once. Fix the issue.

PROBLEM:
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}

SOLUTION:
Notice how whenever the clock updates, “Create Story” is added twice. This serves as a hint that we have a mutation during 
rendering—Strict Mode calls components twice to make these issues more noticeable.
StoryTray function is not pure. By calling push on the received stories array (a prop!), it is mutating an object that was 
created before StoryTray started rendering. This makes it buggy and very difficult to predict.
The simplest fix is to not touch the array at all, and render “Create Story” separately:
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}

Alternatively, you could create a new array (by copying the existing one) before you push an item into it:
export default function StoryTray({ stories }) {
  // Copy the array!
  let storiesToDisplay = stories.slice();

  // Does not affect the original array:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}

It is useful to remember which operations on arrays mutate them, and which don’t. For example, push, pop, reverse, and 
sort will mutate the original array, but slice, filter, and map will create a new one.
*/
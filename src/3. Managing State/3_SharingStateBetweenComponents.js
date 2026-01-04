/*
Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move 
it to their closest common parent, and then pass it down to them via props. This is known as lifting state up, and it’s 
one of the most common things you will do writing React code.
*/

// Lifting State Up
/*
You can “lift state up” to a parent component in three steps:
1. Remove state from the child components.
2. Pass hardcoded data from the common parent.
3. Add state to the common parent and pass it down together with the event handlers.


DEEP DIVE:

Controlled and uncontrolled components 

It is common to call a component with some local state “uncontrolled”. For example, the original Panel component with an 
isActive state variable is uncontrolled because its parent cannot influence whether the panel is active or not.
In contrast, you might say a component is “controlled” when the important information in it is driven by props rather than 
its own local state. This lets the parent component fully specify its behavior. The final Panel component with the isActive 
prop is controlled by the Accordion component.
Uncontrolled components are easier to use within their parents because they require less configuration. But they’re less 
flexible when you want to coordinate them together. Controlled components are maximally flexible, but they require the 
parent components to fully configure them with props.
In practice, “controlled” and “uncontrolled” aren’t strict technical terms—each component usually has some mix of both 
local state and props. However, this is a useful way to talk about how components are designed and what capabilities they 
offer.
When writing a component, consider which information in it should be controlled (via props), and which information should 
be uncontrolled (via state). But you can always change your mind and refactor later.
*/

//-----------------------------------A single source of truth for each state------------------------------------------
/*
In a React application, many components will have their own state. Some state may “live” close to the leaf components 
(components at the bottom of the tree) like inputs. Other state may “live” closer to the top of the app. For example, even 
client-side routing libraries are usually implemented by storing the current route in the React state, and passing it down 
by props!
For each unique piece of state, you will choose the component that “owns” it. This principle is also known as having a 
“single source of truth”. It doesn’t mean that all state lives in one place—but that for each piece of state, there is a 
specific component that holds that piece of information. Instead of duplicating shared state between components, lift it 
up to their common shared parent, and pass it down to the children that need it.
Your app will change as you work on it. It is common that you will move state down or back up while you’re still figuring 
out where each piece of the state “lives”. This is all part of the process!
*/

// RECAP
/*
- When you want to coordinate two components, move their state to their common parent.
- Then pass the information down through props from their common parent.
- Finally, pass the event handlers down so that the children can change the parent’s state.
- It’s useful to consider components as “controlled” (driven by props) or “uncontrolled” (driven by state).
*/
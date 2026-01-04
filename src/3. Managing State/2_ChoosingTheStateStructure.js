/*
Structuring state well can make a difference between a component that is pleasant to modify and debug, and one that is a 
constant source of bugs. Here are some tips you should consider when structuring state.
*/

//-------------------------------------Principles for structuring state------------------------------------------
/*
When you write a component that holds some state, you’ll have to make choices about how many state variables to use and 
what the shape of their data should be. While it’s possible to write correct programs even with a suboptimal state 
structure, there are a few principles that can guide you to make better choices:
1. Group related state. If you always update two or more state variables at the same time, consider merging them into a 
   single state variable.
2. Avoid contradictions in state. When the state is structured in a way that several pieces of state may contradict and 
   “disagree” with each other, you leave room for mistakes. Try to avoid this.
3. Avoid redundant state. If you can calculate some information from the component’s props or its existing state variables 
   during rendering, you should not put that information into that component’s state.
4. Avoid duplication in state. When the same data is duplicated between multiple state variables, or within nested objects, 
   it is difficult to keep them in sync. Reduce duplication when you can.
5. Avoid deeply nested state. Deeply hierarchical state is not very convenient to update. When possible, prefer to 
   structure state in a flat way.

The goal behind these principles is to make state easy to update without introducing mistakes. Removing redundant and 
duplicate data from state helps ensure that all its pieces stay in sync. This is similar to how a database engineer might 
want to “normalize” the database structure to reduce the chance of bugs. To paraphrase Albert Einstein, “Make your state 
as simple as it can be—but no simpler.”
*/

//---------------------------------------Group related state-----------------------------------------------
/*
If some two state variables always change together, it might be a good idea to unify them into a single state variable. 
Then you won’t forget to always keep them in sync.
Another case where you’ll group data into an object or an array is when you don’t know how many pieces of state you’ll 
need. For example, it’s helpful when you have a form where the user can add custom fields.

PITFALL
If your state variable is an object, remember that you can’t update only one field in it without explicitly copying the 
other fields. For example, you can’t do setPosition({ x: 100 }) in the above example because it would not have the y 
property at all! Instead, if you wanted to set x alone, you would either do setPosition({ ...position, x: 100 }), or 
split them into two state variables and do setX(100).
*/

//---------------------------------------Avoid contradictions in state--------------------------------------------
/*
If you can calculate some information from the component’s props or its existing state variables during rendering, you 
should not put that information into that component’s state.

DEEP DIVE:
Don’t mirror props in state 

A common example of redundant state is code like this:

function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
}
Here, a color state variable is initialized to the messageColor prop. The problem is that if the parent component passes 
a different value of messageColor later (for example, 'red' instead of 'blue'), the color state variable would not be 
updated! The state is only initialized during the first render.

This is why “mirroring” some prop in a state variable can lead to confusion. Instead, use the messageColor prop directly 
in your code. If you want to give it a shorter name, use a constant:
function Message({ messageColor }) {
  const color = messageColor;
}

This way it won’t get out of sync with the prop passed from the parent component.

“Mirroring” props into state only makes sense when you want to ignore all updates for a specific prop. By convention, 
start the prop name with initial or default to clarify that its new values are ignored:

function Message({ initialColor }) {
  // The `color` state variable holds the *first* value of `initialColor`.
  // Further changes to the `initialColor` prop are ignored.
  const [color, setColor] = useState(initialColor);
*/

//-------------------------------------Avoid duplication in state-------------------------------------------------

//-------------------------------------Avoid deeply nested state--------------------------------------------------
/*
Updating nested state involves making copies of objects all the way up from the part that changed. Deleting a deeply nested 
place would involve copying its entire parent place chain. Such code can be very verbose.
If the state is too nested to update easily, consider making it “flat”. Here is one way you can restructure this data. 
Instead of a tree-like structure where each place has an array of its child places, you can have each place hold an array 
of its child place IDs. Then store a mapping from each place ID to the corresponding place.

Now that the state is “flat” (also known as “normalized”), updating nested items becomes easier.

In order to remove a place now, you only need to update two levels of state:
- The updated version of its parent place should exclude the removed ID from its childIds array.
- The updated version of the root “table” object should include the updated version of the parent place.

You can nest state as much as you like, but making it “flat” can solve numerous problems. It makes state easier to update, 
and it helps ensure you don’t have duplication in different parts of a nested object.
*/

// RECAP
/*
- If two state variables always update together, consider merging them into one.
- Choose your state variables carefully to avoid creating “impossible” states.
- Structure your state in a way that reduces the chances that you’ll make a mistake updating it.
- Avoid redundant and duplicate state so that you don’t need to keep it in sync.
- Don’t put props into state unless you specifically want to prevent updates.
- For UI patterns like selection, keep ID or index in state instead of the object itself.
- If updating deeply nested state is complicated, try flattening it.
*/
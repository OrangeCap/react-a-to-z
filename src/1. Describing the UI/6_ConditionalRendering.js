/*
Your components will often need to display different things depending on different conditions. In React, you can 
conditionally render JSX using JavaScript syntax like if statements, &&, and ? : operators.
*/

//-----------------------------------Conditionally returning JSX----------------------------------------
/*
You can use an if/else statement like so:

if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;

If the isPacked prop is true, this code returns a different JSX tree.

Notice how you’re creating branching logic with JavaScript’s if and return statements. In React, control flow 
(like conditions) is handled by JavaScript.
*/

//------------------------------------Conditionally returning nothing with null------------------------------------
/*
In some situations, you won’t want to render anything at all. For example, say you don’t want to show packed items at 
all. A component must return something. In this case, you can return null:

if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;

In practice, returning null from a component isn’t common because it might surprise a developer trying to render it. 
More often, you would conditionally include or exclude the component in the parent component’s JSX. Here’s how to do that!
*/

//-------------------------------------Conditionally including JSX---------------------------------------------
/*
Conditional (ternary) operator (? :) 
JavaScript has a compact syntax for writing a conditional expression — the conditional operator or “ternary operator”.

Instead of this:
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;

You can write this:
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);

You can read it as “if isPacked is true, then (?) render name + ' ✔', otherwise (:) render name”.

DEEP DIVE:
Are these two examples fully equivalent? 

If you’re coming from an object-oriented programming background, you might assume that the two examples above are subtly 
different because one of them may create two different “instances” of <li>. But JSX elements aren’t “instances” because 
they don’t hold any internal state and aren’t real DOM nodes. They’re lightweight descriptions, like blueprints. So these 
two examples, in fact, are completely equivalent. Preserving and Resetting State goes into detail about how this works.

Now let’s say you want to wrap the completed item’s text into another HTML tag, like <del> to strike it out. You can add 
even more newlines and parentheses so that it’s easier to nest more JSX in each of the cases:
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

This style works well for simple conditions, but use it in moderation. If your components get messy with too much nested 
conditional markup, consider extracting child components to clean things up. In React, markup is a part of your code, so 
you can use tools like variables and functions to tidy up complex expressions.
*/

//------------------------------------------Logical AND operator (&&)-----------------------------------------
/*
Another common shortcut you’ll encounter is the JavaScript logical AND (&&) operator. Inside React components, it often 
comes up when you want to render some JSX when the condition is true, or render nothing otherwise. With &&, you could 
conditionally render the checkmark only if isPacked is true:

return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
You can read this as “if isPacked, then (&&) render the checkmark, otherwise, render nothing”.

A JavaScript && expression returns the value of its right side (in our case, the checkmark) if the left side 
(our condition) is true. But if the condition is false, the whole expression becomes false. React considers false as a 
“hole” in the JSX tree, just like null or undefined, and doesn’t render anything in its place.

PITFALL:
Don’t put numbers on the left side of &&.
To test the condition, JavaScript converts the left side to a boolean automatically. However, if the left side is 0, then 
the whole expression gets that value (0), and React will happily render 0 rather than nothing.
For example, a common mistake is to write code like messageCount && <p>New messages</p>. It’s easy to assume that it 
renders nothing when messageCount is 0, but it really renders the 0 itself!
To fix it, make the left side a boolean: messageCount > 0 && <p>New messages</p>.
*/

//-------------------------------------Conditionally assigning JSX to a variable----------------------------------
/*
When the shortcuts get in the way of writing plain code, try using an if statement and a variable. You can reassign 
variables defined with let, so start by providing the default content you want to display, the name:

let itemContent = name;

Use an if statement to reassign a JSX expression to itemContent if isPacked is true:
if (isPacked) {
  itemContent = name + " ✔";
}

Curly braces open the “window into JavaScript”. Embed the variable with curly braces in the returned JSX tree, nesting 
the previously calculated expression inside of JSX.
<li className="item">
  {itemContent}
</li>
This style is the most verbose, but it’s also the most flexible.

This works not only for text, but for arbitrary JSX too.
let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
);
*/

//RECAP
/*
Recap
In React, you control branching logic with JavaScript.
You can return a JSX expression conditionally with an if statement.
You can conditionally save some JSX to a variable and then include it inside other JSX by using the curly braces.
In JSX, {cond ? <A /> : <B />} means “if cond, render <A />, otherwise <B />”.
In JSX, {cond && <A />} means “if cond, render <A />, otherwise nothing”.
The shortcuts are common, but you don’t have to use them if you prefer plain if.
*/ 
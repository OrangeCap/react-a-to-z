import { useState } from "react";
/*
React can change how you think about the designs you look at and the apps you build. When you build a user 
interface with React, you will first break it apart into pieces called components. Then, you will describe the 
different visual states for each of your components. Finally, you will connect your components together so that the 
data flows through them.*/

// In this tutorial, we’ll guide you through the thought process of building a searchable product data table with React.

// Imagine The JSON API returns some data that looks like this:

const data = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

// To implement a UI in React, you will usually follow the same five steps.

/*--------------------STEP 1 : Break the UI into a component hierarchy--------------------------*/
/*
Start by drawing boxes around every component and subcomponent in the mockup and naming them. If you work with a designer, 
they may have already named these components in their design tool. Ask them!

Depending on your background, you can think about splitting up a design into components in different ways:

Programming—use the same techniques for deciding if you should create a new function or object. One such technique is the 
single responsibility principle*, that is, a component should ideally only do one thing. If it ends up growing, it should 
be decomposed into smaller subcomponents.
CSS—consider what you would make class selectors for. (However, components are a bit less granular.)
Design—consider how you would organize the design’s layers.
If your JSON is well-structured, you’ll often find that it naturally maps to the component structure of your UI. 
That’s because UI and data models often have the same information architecture—that is, the same shape. Separate your 
UI into components, where each component matches one piece of your data model.

*https://en.wikipedia.org/wiki/Single-responsibility_principle
*/

/*-------------------Step 2: Build a static version in React-------------------------------------*/
/*
Now that you have your component hierarchy, it’s time to implement your app. The most straightforward approach is to build 
a version that renders the UI from your data model without adding any interactivity… yet! It’s often easier to build the 
static version first and add interactivity later. Building a static version requires a lot of typing and no thinking, but 
adding interactivity requires a lot of thinking and not a lot of typing.

To build a static version of your app that renders your data model, you’ll want to build components that reuse other 
components and pass data using props. Props are a way of passing data from parent to child. (If you’re familiar with the 
concept of state, don’t use state at all to build this static version. State is reserved only for interactivity, that is, 
data that changes over time. Since this is a static version of the app, you don’t need it.)

You can either build “top down” by starting with building the components higher up in the hierarchy 
(like FilterableProductTable) or “bottom up” by working from components lower down (like ProductRow). In simpler examples, 
it’s usually easier to go top-down, and on larger projects, it’s easier to go bottom-up.
*/

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if(product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1){
      return;
    }
    if(inStockOnly && !product.stocked){
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input type="checkbox" 
        checked={inStockOnly}
        onChange={(e) => onInStockOnlyChange(e.target.checked)}/>{' '} Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}

/*------------------Step 3: Find the minimal but complete representation of UI state--------------------------*/
/*
To make the UI interactive, you need to let users change your underlying data model. You will use state for this.

Think of state as the minimal set of changing data that your app needs to remember. The most important principle for 
structuring state is to keep it DRY (Don’t Repeat Yourself). Figure out the absolute minimal representation of the state 
your application needs and compute everything else on-demand. For example, if you’re building a shopping list, you can 
store the items as an array in state. If you want to also display the number of items in the list, don’t store the number 
of items as another state value—instead, read the length of your array.

Now think of all of the pieces of data in this example application:

Now think of all of the pieces of data in this example application:

The original list of products
The search text the user has entered
The value of the checkbox
The filtered list of products

Which of these are state? Identify the ones that are not:
Does it remain unchanged over time? If so, it isn’t state.
Is it passed in from a parent via props? If so, it isn’t state.
Can you compute it based on existing state or props in your component? If so, it definitely isn’t state!
What’s left is probably state.

Let’s go through them one by one again:
The original list of products is passed in as props, so it’s not state.
The search text seems to be state since it changes over time and can’t be computed from anything.
The value of the checkbox seems to be state since it changes over time and can’t be computed from anything.
The filtered list of products isn’t state because it can be computed by taking the original list of products and 
filtering it according to the search text and value of the checkbox.
This means only the search text and the value of the checkbox are state!
*/

/*
Props vs State

There are two types of “model” data in React: props and state. The two are very different:

Props are like arguments you pass to a function. They let a parent component pass data to a child component and customize 
its appearance. For example, a Form can pass a color prop to a Button.
State is like a component’s memory. It lets a component keep track of some information and change it in response to 
interactions. For example, a Button might keep track of isHovered state.
Props and state are different, but they work together. A parent component will often keep some information in state 
(so that it can change it), and pass it down to child components as their props. It’s okay if the difference still feels 
fuzzy on the first read. It takes a bit of practice for it to really stick!
*/

//-------------------Step 4: Identify where your state should live--------------------------------------
/*
After identifying your app’s minimal state data, you need to identify which component is responsible for changing this 
state, or owns the state. Remember: React uses one-way data flow, passing data down the component hierarchy from parent 
to child component. It may not be immediately clear which component should own what state. This can be challenging if 
you’re new to this concept, but you can figure it out by following these steps!

For each piece of state in your application:

1. Identify every component that renders something based on that state.
2. Find their closest common parent component—a component above them all in the hierarchy.
3. Decide where the state should live:
  1. Often, you can put the state directly into their common parent.
  2. You can also put the state into some component above their common parent.
  3. If you can’t find a component where it makes sense to own the state, create a new component solely for holding the 
  state and add it somewhere in the hierarchy above the common parent component.
  
In the previous step, you found two pieces of state in this application: the search input text, and the value of the 
checkbox. In this example, they always appear together, so it makes sense to put them into the same place.

Now let’s run through our strategy for them:

1. Identify components that use state:
ProductTable needs to filter the product list based on that state (search text and checkbox value).
SearchBar needs to display that state (search text and checkbox value).
2. Find their common parent: The first parent component both components share is FilterableProductTable.
3. Decide where the state lives: We’ll keep the filter text and checked state values in FilterableProductTable.
*/

//----------------------Step 5: Add inverse data flow------------------------------
/*
Currently your app renders correctly with props and state flowing down the hierarchy. But to change the state according 
to user input, you will need to support data flowing the other way: the form components deep in the hierarchy need to 
update the state in FilterableProductTable.
React makes this data flow explicit, but it requires a little more typing than two-way data binding. If you try to type or 
check the box in the example above, you’ll see that React ignores your input. This is intentional. By writing 
<input value={filterText} />, you’ve set the value prop of the input to always be equal to the filterText state passed in 
from FilterableProductTable. Since filterText state is never set, the input never changes.
You want to make it so whenever the user changes the form inputs, the state updates to reflect those changes. The state 
is owned by FilterableProductTable, so only it can call setFilterText and setInStockOnly. To let SearchBar update the 
FilterableProductTable’s state, you need to pass these functions down to SearchBar.

Inside the SearchBar, you will add the onChange event handlers and set the parent state from them.
*/

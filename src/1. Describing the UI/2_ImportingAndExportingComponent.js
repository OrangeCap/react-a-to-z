//----------------------------Importing and Exporting Components------------------------------------------
/*
The magic of components lies in their reusability: you can create components that are composed of other components. But 
as you nest more and more components, it often makes sense to start splitting them into different files. This lets you 
keep your files easy to scan and reuse components in more places.
*/

//-------------------------------The root Component File-------------------------------------------------
/*
In Your First Component, you made a Profile component and a Gallery component that renders it:
These currently live in a root component file, named App.js in this example. In Create React App, your app lives in 
src/App.js. Depending on your setup, your root component could be in another file, though. If you use a framework with 
file-based routing, such as Next.js, your root component will be different for every page.
*/

//----------------------------Exporting and Importing a Component------------------------------------------\
/*
What if you want to change the landing screen in the future and put a list of science books there? Or place all the 
profiles somewhere else? It makes sense to move Gallery and Profile out of the root component file. This will make them 
more modular and reusable in other files. 

You can move a component in three steps:
1. Make a new JS file to put the components in.
2. Export your function component from that file (using either default or named exports).
3. Import it in the file where you’ll use the component (using the corresponding technique for importing default 
    or named exports).

NOTE:
You may encounter files that leave off the .js file extension like so:
import Gallery from './Gallery';
Either './Gallery.js' or './Gallery' will work with React, though the former is closer to how native ES Modules work.

DEEP DIVE:
Default vs named exports 

There are two primary ways to export values with JavaScript: default exports and named exports. 
You can use one or both of them in the same file. 
A file can have no more than one default export, but it can have as many named exports as you like.

Default and named exports
How you export your component dictates how you must import it. You will get an error if you try to import a default export 
the same way you would a named export! This chart can help you keep track:

Syntax	         Export statement	                        Import statement
Default	   export default function Button() {}	   import Button from './Button.js';
Named	   export function Button() {}	           import { Button } from './Button.js';
When you write a default import, you can put any name you want after import. 
For example, you could write import Banana from './Button.js' instead and it would still provide you with the same default 
export. In contrast, with named imports, the name has to match on both sides. That’s why they are called named imports!

People often use default exports if the file exports only one component, and use named exports if it exports multiple 
components and values. Regardless of which coding style you prefer, always give meaningful names to your component 
functions and the files that contain them. 
Components without names, like export default () => {}, are discouraged because they make debugging harder.
*/

//---------------------Exporting and importing multiple components from the same file-----------------------------------
/*
A file can only have one default export, but it can have numerous named exports!

NOTE:
To reduce the potential confusion between default and named exports, some teams choose to only stick to one style 
(default or named), or avoid mixing them in a single file. Do what works best for you!
*/

/*
RECAP

On this page you learned:

What a root component file is
How to import and export a component
When and how to use default and named imports and exports
How to export multiple components from the same file
*/
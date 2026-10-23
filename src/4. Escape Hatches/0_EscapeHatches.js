/**
 Some of your components may need to control and synchronize with systems outside of React.
 For example, you might need to focus an input using the browser API, play and pause a video
 player implemented without React, or connect and listen to messages from a remote server.
 In this chapter, you’ll learn the escape hatches that let you “step outside” React and connect to
 external systems. Most of your application logic and data flow should not rely on these features
 */

 //-----------------------------Referencing values with refs------------------------------

 /*
 When you want a component to “remember” some information, but you don’t want that information to
 trigger new renders, you can use a ref:
  const ref = useRef(0);

 Like state, refs are retained by React between re-renders. However, setting state re-renders a
 component. Changing a ref does not! You can access the current value of that ref through the
 ref.current property.
*/

import { useState, useRef, useEffect, useEffectEvent } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}

/*
 A ref is like a secret pocket of your component that React doesn’t track. For example, you can
 use refs to store timeout IDs, DOM elements, and other objects that don’t impact the component’s
 rendering output.
*/

//-----------------------------Manipulating the DOM with refs------------------------------
/*
 React automatically updates the DOM to match your render output, so your components won’t often
 need to manipulate it. However, sometimes you might need access to the DOM elements managed by
 React—for example, to focus a node, scroll to it, or measure its size and position. There is no
 built-in way to do those things in React, so you will need a ref to the DOM node.
 For example, clicking the button will focus the input using a ref:
*/
export function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}

//-----------------------------Synchronizing with Effects------------------------------------
/*
 Some components need to synchronize with external systems. For example, you might want to control
 a non-React component based on the React state, set up a server connection, or send an analytics
 log when a component appears on the screen. Unlike event handlers, which let you handle particular
 events, Effects let you run some code after rendering. Use them to synchronize your component with
 a system outside of React.
*/
// Press Play/Pause a few times and see how the video player stays synchronized to the isPlaying prop value

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}

/*
 Many Effects also “clean up” after themselves. For example, an Effect that sets up a connection
 to a chat server should return a cleanup function that tells React how to disconnect your
 component from that server:
*/

export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}

export function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}

/*
 In development, React will immediately run and clean up your Effect one extra time. This is why
 you see "✅ Connecting..." printed twice. This ensures that you don’t forget to implement the
 cleanup function.
*/

//----------------------------------You Might Not Need An Effect-------------------------------
/*
 Effects are an escape hatch from the React paradigm. They let you “step outside” of React and
 synchronize your components with some external system. If there is no external system involved
 (for example, if you want to update a component’s state when some props or state change), you
 shouldn’t need an Effect. Removing unnecessary Effects will make your code easier to follow,
 faster to run, and less error-prone.

 There are two common cases in which you don’t need Effects:
 1. You don’t need Effects to transform data for rendering.
 2. You don’t need Effects to handle user events.
*/

// For example, you don’t need an Effect to adjust some state based on other state:

function Form2() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}

function Form3() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}

//-------------------------Lifecycle of reactive effects-----------------------
/**
 * Effects have a different lifecycle from components. Components may mount, update, or unmount.
 * An Effect can only do two things:
 * to start synchronizing something,
 * and later to stop synchronizing it.
 * This cycle can happen multiple times if your Effect depends on props and state that
 * change over time.
 */

// This Effect depends on the value of the roomId prop. Props are reactive values,
// which means they can change on a re-render.
// Notice that the Effect re-synchronizes (and re-connects to the server) if roomId changes:
function createConnectionToRoom(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}

const serverUrl = 'https://localhost:1234';

export function ChatRoomWithRoomId({ roomId }) {
  useEffect(() => {
    const connection = createConnectionToRoom(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export function ChatRoomApp() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}

/**
 * React provides a linter rule to check that you’ve specified your Effect’s dependencies correctly.
 * If you forget to specify roomId in the list of dependencies in the above example, the linter will
 * find that bug automatically.
 */


//----------------------------------Separating events from Effects-----------------------------
/**
 * Event handlers only re-run when you perform the same interaction again. Unlike event handlers,
 * Effects re-synchronize if any of the values they read, like props or state, are different than
 * during last render. Sometimes, you want a mix of both behaviors: an Effect that re-runs in
 * response to some values but not others.
 * 
 * All code inside Effects is reactive. It will run again if some reactive value it reads has
 * changed due to a re-render.
 */

// For example, this Effect will re-connect to the chat if either roomId or theme have changed:
function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}

function createConnection3(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}

function ChatRoom3({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection3(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export function AppInEfficient() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom3
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}

// This is not ideal. You want to re-connect to the chat only if the roomId has changed.
// Switching the theme shouldn’t re-connect to the chat! Move the code reading theme out
// of your Effect into an Effect Event:
function ChatRoom4({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export function AppEfficient() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom4
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}

// Code inside Effect Events isn’t reactive,
// so changing the theme no longer makes your Effect re-connect.

//----------------------------------Removing Effect dependencies-----------------------------
/**
 * When you write an Effect, the linter will verify that you’ve included every reactive value
 * (like props and state) that the Effect reads in the list of your Effect’s dependencies.
 * This ensures that your Effect remains synchronized with the latest props and state of your
 * component. Unnecessary dependencies may cause your Effect to run too often, or even create an
 * infinite loop. The way you remove them depends on the case.
 */

// For example, this Effect depends on the options object which gets re-created every time you
// edit the input:




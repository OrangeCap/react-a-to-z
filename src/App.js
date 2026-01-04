import "./App.css";
import React from "react";
import Game from "./Tutorial_tic-tac-toe/tic-tac-toe/tic-tac-toe";
import Product from "./Thinking in React/ThinkingInReact";
import Profile from "./Describing the UI/5_PassingPropsToAComponent";
import List, { FilteredList } from "./Describing the UI/7_RenderingList";
import Gallery, {
  Form,
  Counter,
  Counter2,
  ObjectUpdate,
} from "./Adding Interactivity/0_AddingInteractivity";
import Toolbar from "./Adding Interactivity/1_RespondingToEvents";
import Clock from "./Adding Interactivity/3_RenderAndCommit";
import FormState, {
  CounterState,
  CounterStateOverTime,
  CounterStateOverTimeAsync,
  FormHello,
} from "./Adding Interactivity/4_StateAsASnapshot";
import CounterMultiple from "./Adding Interactivity/5_QueueingASeriesOfStateUpdates";
import MovingDotMutatedState, {
  MovingDot,
  FormMutated,
  Form as FormNonMutated,
  FormNestedUpdate,
  FormImmer,
} from "./Adding Interactivity/6_UpdatingObjectsInState";

function App() {
  return (
    <React.StrictMode>
      <div className="App">
        <Game />
        <br />
        <Product />
        <br />
        <Profile />
        <br />
        <List />
        <br />
        <FilteredList />
        <br />
        <Gallery />
        <br />
        <Form />
        <br />
        <Counter />
        <br />
        <Counter2 />
        <br />
        <ObjectUpdate />
        <br />
        <Toolbar />
        <br />
        <Clock />
        <br />
        <FormState />
        <br />
        <CounterState />
        <br />
        <CounterStateOverTime />
        <br />
        <CounterStateOverTimeAsync />
        <br />
        <FormHello />
        <br />
        <CounterMultiple />
        <br />
        <MovingDotMutatedState />
        <br />
        <MovingDot />
        <br />
        <FormMutated />
        <br />
        <FormNonMutated />
        <br />
        <FormNestedUpdate />
        <br />
        <FormImmer />
      </div>
    </React.StrictMode>
  );
}

export default App;

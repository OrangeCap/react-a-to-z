import "./App.css";
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  Outlet,
  useParams,
} from "react-router-dom";

// Get Started
import Game from "./Tutorial_tic-tac-toe/tic-tac-toe/tic-tac-toe";
import Product from "./Thinking in React/ThinkingInReact";

// 1. Describing the UI
import Profile from "./1. Describing the UI/5_PassingPropsToAComponent";
import List, { FilteredList } from "./1. Describing the UI/7_RenderingList";

// 2. Adding Interactivity
import Gallery, {
  Form,
  Counter,
  Counter2,
  ObjectUpdate,
} from "./2. Adding Interactivity/0_AddingInteractivity";
import Toolbar from "./2. Adding Interactivity/1_RespondingToEvents";
import Clock from "./2. Adding Interactivity/3_RenderAndCommit";
import FormState, {
  CounterState,
  CounterStateOverTime,
  CounterStateOverTimeAsync,
  FormHello,
} from "./2. Adding Interactivity/4_StateAsASnapshot";
import CounterMultiple from "./2. Adding Interactivity/5_QueueingASeriesOfStateUpdates";
import MovingDotMutatedState, {
  MovingDot,
  FormMutated,
  Form as FormNonMutated,
  FormNestedUpdate,
  FormImmer,
} from "./2. Adding Interactivity/6_UpdatingObjectsInState";

// 3. Managing State
// The lesson files reference AddTask, TaskList and tasksReducer, which don't
// exist yet, so they're not wired up.

// 4. Escape Hatches
// 0_EscapeHatches.js needs toastify-js and useEffectEvent (not in React 18),
// so it's not wired up yet.

// Mirrors react.dev/learn: a Get Started intro plus the 4 main chapters,
// each made up of lessons. A lesson renders all of its demo components.
const sections = [
  {
    slug: "get-started",
    title: "Get Started",
    lessons: [
      {
        slug: "tutorial-tic-tac-toe",
        title: "Tutorial: Tic-Tac-Toe",
        demos: [Game],
      },
      {
        slug: "thinking-in-react",
        title: "Thinking in React",
        demos: [Product],
      },
    ],
  },
  {
    slug: "describing-the-ui",
    title: "Describing the UI",
    lessons: [
      {
        slug: "passing-props-to-a-component",
        title: "Passing Props to a Component",
        demos: [Profile],
      },
      {
        slug: "rendering-lists",
        title: "Rendering Lists",
        demos: [List, FilteredList],
      },
    ],
  },
  {
    slug: "adding-interactivity",
    title: "Adding Interactivity",
    lessons: [
      {
        slug: "overview",
        title: "Overview",
        demos: [Gallery, Form, Counter, Counter2, ObjectUpdate],
      },
      {
        slug: "responding-to-events",
        title: "Responding to Events",
        demos: [Toolbar],
      },
      { slug: "render-and-commit", title: "Render and Commit", demos: [Clock] },
      {
        slug: "state-as-a-snapshot",
        title: "State as a Snapshot",
        demos: [
          FormState,
          CounterState,
          CounterStateOverTime,
          CounterStateOverTimeAsync,
          FormHello,
        ],
      },
      {
        slug: "queueing-a-series-of-state-updates",
        title: "Queueing a Series of State Updates",
        demos: [CounterMultiple],
      },
      {
        slug: "updating-objects-in-state",
        title: "Updating Objects in State",
        demos: [
          MovingDotMutatedState,
          MovingDot,
          FormMutated,
          FormNonMutated,
          FormNestedUpdate,
          FormImmer,
        ],
      },
    ],
  },
  {
    slug: "managing-state",
    title: "Managing State",
    lessons: [],
  },
  {
    slug: "escape-hatches",
    title: "Escape Hatches",
    lessons: [],
  },
];

function Layout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="layout">
      <aside className={`sidebar-wrapper ${isOpen ? "" : "collapsed"}`}>
        <button
          className="sidebar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isOpen}
        >
          {isOpen ? "‹" : "›"}
        </button>
        <nav className="sidebar" hidden={!isOpen}>
          <NavLink to="/" end className="home-link">
            React A to Z
          </NavLink>
          {sections.map((section) => (
            <div key={section.slug} className="nav-section">
              <NavLink
                to={`/learn/${section.slug}`}
                end
                className="nav-section-title"
              >
                {section.title}
              </NavLink>
              <ul>
                {section.lessons.map((lesson) => (
                  <li key={lesson.slug}>
                    <NavLink to={`/learn/${section.slug}/${lesson.slug}`}>
                      {lesson.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  return (
    <>
      <h1>Learn React</h1>
      <p>Pick a section to start.</p>
      <ul>
        {sections.map((section) => (
          <li key={section.slug}>
            <NavLink to={`/learn/${section.slug}`}>{section.title}</NavLink>
          </li>
        ))}
      </ul>
    </>
  );
}

function SectionPage() {
  const { sectionSlug } = useParams();
  const section = sections.find((s) => s.slug === sectionSlug);
  if (!section) return <NotFound />;

  return (
    <>
      <h1>{section.title}</h1>
      {section.lessons.length === 0 && <p>No lessons yet.</p>}
      <ol>
        {section.lessons.map((lesson) => (
          <li key={lesson.slug}>
            <NavLink to={lesson.slug}>{lesson.title}</NavLink>
          </li>
        ))}
      </ol>
    </>
  );
}

function LessonPage() {
  const { sectionSlug, lessonSlug } = useParams();
  const section = sections.find((s) => s.slug === sectionSlug);
  const lesson = section?.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return <NotFound />;

  return (
    <>
      <p className="breadcrumb">
        <NavLink to={`/learn/${section.slug}`}>{section.title}</NavLink>
      </p>
      <h1>{lesson.title}</h1>
      {lesson.demos.map((Demo, i) => (
        <section key={i} className="demo">
          <Demo />
        </section>
      ))}
    </>
  );
}

function NotFound() {
  return <h1>Page not found</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="learn"
            element={<Navigate to="/learn/get-started" replace />}
          />
          <Route path="learn/:sectionSlug" element={<SectionPage />} />
          <Route
            path="learn/:sectionSlug/:lessonSlug"
            element={<LessonPage />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

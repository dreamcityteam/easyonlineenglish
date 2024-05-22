import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './normalize.css';
import './App.sass';

const container: HTMLElement = document.getElementById('root') as HTMLElement;

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/*
  In the future, we're going to use these lines of code to implement server side rendering.

  const root: Root = hydrateRoot(
    container, (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  );
*/
import 'react-app-polyfill/ie11';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'
import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { BoatRegister } from './app.jsx'

// convert paragraph elements with <<xxxx>> to divs so that we can nest p and divs inside them
// we need this because most editors don't have html access.
function handleParagraphs() {
  const allparas = document.getElementsByTagName('p');
  for (let i = 0; i < allparas.length; i++) {
    const p = allparas.item(i);
    const text = p.innerText;
    const q = text.match(/^<<(.*?):(.*)>>$/);
    if (q?.length === 3) {
      const [, component, arglist] = q;
      const args = arglist.split(':');
      const al = args.map((a, index) => `data-oga-arg${index}="${a.trim()}"`).join(' ');
      p.outerHTML = `<div data-oga-component=${component} ${al}></div>`;
    }
  }
}

handleParagraphs();
const placeholders = document.querySelectorAll("[data-oga-component]");
placeholders.forEach((ph) => {
  const attr = ph.dataset;
  createRoot(ph).render(
    <React.StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <BoatRegister {...attr} />
    </StyledEngineProvider>
    </React.StrictMode>,
  );
});

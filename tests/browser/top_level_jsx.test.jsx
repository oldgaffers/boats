import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('top-level jsx modules (main/index/app) - browser mode', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('main.jsx converts paragraph markers to placeholders and calls createRoot.render', async () => {
    const p = document.createElement('p');
    p.innerText = '<<app:foo:bar>>';
    document.body.appendChild(p);

    // expose render mock on global so the mock factory can access it when evaluated
    globalThis.__renderMock = vi.fn();
    vi.mock('react-dom/client', () => ({
      createRoot: () => ({ render: globalThis.__renderMock })
    }));

    // dynamic import after mocks so side-effects use the mocked createRoot
    await import('../../src/main.jsx');

    const placeholder = document.querySelector('[data-oga-component]');
    expect(placeholder).toBeTruthy();
    expect(placeholder.dataset.ogaArg0).toBe('foo');
    expect(globalThis.__renderMock).toHaveBeenCalled();
  });

  it('BoatRegister from app.jsx can be created as a React element', async () => {
    const React = await import('react');
    const mod = await import('../../src/app.jsx');
    const el = React.createElement(mod.BoatRegister, { ogaComponent: 'login' });
    expect(el).toBeTruthy();
  });
});

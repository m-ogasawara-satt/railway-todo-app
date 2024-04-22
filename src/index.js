import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { store } from './store';

// ReactDOM.render()は古いReactのバージョンで使われている方法となる（アプリケーションをDOMに同期的にレンダリングする）
// Reactのバージョンアップ後はReactDOM.createRoot()を使用。これは、React17以降で導入された。
// アプリケーションをDOMに非同期的にレンダリングする。（前よりアプリケーションのパフォーマンスが向上する）
const root = document.getElementById('root');
if (root !== null) {
  createRoot(root).render(
    <Provider store={store}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </Provider>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Router } from "wouter";
import store from "@/store";
import "./global.css";
import App from "./App";

const base = import.meta.env.DEV ? "/" : "/the-worst-volumn-control";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Router base={base}>
        <App />
      </Router>
    </Provider>
  </StrictMode>
);

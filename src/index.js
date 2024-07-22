import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import "./global/main.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthProvider";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <AuthProvider> */}
          <App />
        {/* </AuthProvider> */}
        <ReactQueryDevtools initialIsOpen />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

import React, { useEffect, useState } from "react";
import Sidebar from "./Component/Sidebar";
import { Route, Routes } from "react-router-dom";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import AppRouting from "./AppRouting";
import LeftSidebar from "./Component/leftSidebar";
import { AuthProvider } from "./Auth/AuthProvider";
import { httpRequestInterceptors } from "./interceptors/request.interceptors";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: ["Cairo", "sans-serif"].join(","),
  },
});

const App = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const handleSidebarItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  useEffect(() => {
    httpRequestInterceptors();

    return () => {};
  }, []);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div className="App" dir="rtl">
          {/* <Sidebar selectedMenuItem={selectedMenuItem} /> */}
          <main className="content">
            <AppRouting />
          </main>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;

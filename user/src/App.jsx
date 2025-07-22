//import React from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes"; // đường dẫn tới file chứa các routes

function App() {
  const routing = useRoutes(routes);
  return routing;
}
export default App;

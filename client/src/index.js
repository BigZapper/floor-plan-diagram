import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthContextProvider } from "./authContext/AuthContext";
import { BuildingContextProvider } from "./buildingContext/BuildingContext";
import ShapeContextProvider from "./shapeContext/context";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BuildingContextProvider>
        <ShapeContextProvider>
          <App />
        </ShapeContextProvider>
      </BuildingContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

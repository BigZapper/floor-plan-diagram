import { createContext, useReducer } from "react";
import BuildingReducer from "./BuildingReducer";

const INITIAL_STATE = {
  listBuilding: [],
  building: null,
  isFetching: false,
  error: false,
};

export const BuildingContext = createContext(INITIAL_STATE);

export const BuildingContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BuildingReducer, INITIAL_STATE);

  return (
    <BuildingContext.Provider
      value={{
        listBuilding: state.listBuilding,
        building: state.building,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </BuildingContext.Provider>
  );
};

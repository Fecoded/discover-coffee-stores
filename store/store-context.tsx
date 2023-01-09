import React, { createContext, Dispatch, ReactNode, useReducer } from "react";

export const ACTION_TYPES = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

type TCoffee = {
  id: string;
  name: string;
  imgUrl: string;
  address: string;
  neighorhood: string;
};

type StateInterface = {
  latLong: string;
  coffeeStores: TCoffee[];
};

interface ActionInterface {
  type: string;
  payload: StateInterface;
}

export type StoreContextProps = {
  dispatch: Dispatch<ActionInterface>;
  state: StateInterface;
};

export const StoreContext = createContext<StoreContextProps>(
  {} as StoreContextProps
);

const storeReducer = (state: StateInterface, action: ActionInterface) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return { ...state, latLong: action.payload.latLong };
    }
    case ACTION_TYPES.SET_COFFEE_STORES: {
      return { ...state, coffeeStores: action.payload.coffeeStores };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

type Props = {
  children: ReactNode;
};

const initialState: StateInterface = {
  latLong: "",
  coffeeStores: [],
};

const StoreProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;

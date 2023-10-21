import { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Enfermedad } from '../Models';
import { getAllEnfermedad } from '../services';

interface FilterInterface {
  order?: string,
  orderBy?: string,
  searchFor?: string
}

interface EnfermedadState {
  rows: Enfermedad[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  updatedItem: boolean;
  filters: FilterInterface; 
}

type EnfermedadActions =
  | { type: "SET_ITEM"; rows: Enfermedad[]; pagina: number; cantidad: number; itemCounts: number; filters?: FilterInterface }
  | { type: "UPDATE_ITEM"; id: string; updateData: Enfermedad }
  | { type: "DELETE_ITEM"; id: string }
  | { type: "CREATE_ITEM"; newData: Enfermedad };

export const EnfermedadContext = createContext<{
  state: EnfermedadState;
  dispatch: React.Dispatch<EnfermedadActions>;
} | undefined>(undefined);

const enfermedadReducer = (
  state: EnfermedadState,
  action: EnfermedadActions
): EnfermedadState => {
  switch (action.type) {
    case 'SET_ITEM':
      return {
        ...state,
        rows: action.rows,
        cantidad: action.cantidad,
        pagina: action.pagina,
        itemCounts: action.itemCounts,
        filters: action.filters || {}
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        rows: state.rows.map(enfermedad =>
          enfermedad._id === action.id ? { ...enfermedad, ...action.updateData } : enfermedad
        ),
        updatedItem: !state.updatedItem
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        rows: state.rows.filter(enfermedad => enfermedad._id !== action.id),
        itemCounts: state.itemCounts - 1
      };
    case 'CREATE_ITEM':
      return {
        ...state,
        rows: [...state.rows, action.newData],
        itemCounts: state.itemCounts + 1
      };
    default:
      return state;
  }
};

export const EnfermedadContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: EnfermedadState = {
    rows: [],
    cantidad: 5,
    pagina: 1,
    itemCounts: 0,
    updatedItem: false,
    filters: {
      order: "asc",
      orderBy: "",
      searchFor: ""
    }
  };

  const [state, dispatch] = useReducer(enfermedadReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        await getAllEnfermedad(cantidad, pagina, searchFor, orderBy, order)
          .then((data) => {
            dispatch({
              type: 'SET_ITEM',
              rows: data.data,
              pagina,
              cantidad,
              itemCounts: data.itemCounts as number,
              filters
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log("Error Fetching Data: ", error);
      }
    }
    fetchData();
  }, [dispatch,state.itemCounts, state.cantidad, state.pagina, state.filters, state.updatedItem]);

  return (
    <EnfermedadContext.Provider value={{ state, dispatch }}>
      {children}
    </EnfermedadContext.Provider>
  );
};

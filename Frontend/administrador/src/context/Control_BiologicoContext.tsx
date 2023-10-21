import { createContext, useReducer, ReactNode, useEffect } from 'react';
import { ControlBiologico } from '../Models';
import { getAllControlBiologico } from '../services';

interface FilterInterface {
  order?: string,
  orderBy?: string,
  searchFor?: string
}

interface ControlBiologicoState {
  rows: ControlBiologico[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  updatedItem: boolean;
  filters: FilterInterface; // Agregar el objeto de filtros aquí
}

type ControlBiologicoActions =
  | { type: "SET_ITEM"; rows: ControlBiologico[]; pagina: number; cantidad: number; itemCounts: number; filters?: FilterInterface }
  | { type: "UPDATE_ITEM"; id: string; updateData: ControlBiologico }
  | { type: "DELETE_ITEM"; id: string }
  | { type: "CREATE_ITEM"; newData: ControlBiologico };

export const ControlBiologicoContext = createContext<{
  state: ControlBiologicoState;
  dispatch: React.Dispatch<ControlBiologicoActions>;
} | undefined>(undefined);

const controlBiologicoReducer = (
  state: ControlBiologicoState,
  action: ControlBiologicoActions
): ControlBiologicoState => {
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
        rows: state.rows.map(controlBiologico =>
          controlBiologico._id === action.id ? { ...controlBiologico, ...action.updateData } : controlBiologico
        ),
        updatedItem: !state.updatedItem
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        rows: state.rows.filter(controlBiologico => controlBiologico._id !== action.id),
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

export const ControlBiologicoContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: ControlBiologicoState = {
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

  const [state, dispatch] = useReducer(controlBiologicoReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        await getAllControlBiologico(cantidad, pagina, searchFor, orderBy, order )
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
    <ControlBiologicoContext.Provider value={{ state, dispatch }}>
      {children}
    </ControlBiologicoContext.Provider>
  );
};

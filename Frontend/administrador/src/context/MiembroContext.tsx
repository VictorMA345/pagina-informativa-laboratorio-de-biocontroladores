import { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Miembro } from '../Models';
import { getAllMiembros } from '../services';

interface FilterInterface {
  order?: string,
  orderBy?: string,
  searchFor?: string
}

interface MiembroState {
  rows: Miembro[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  updatedItem: boolean;
  filters: FilterInterface;
}

type MiembroActions =
  | { type: "SET_ITEM"; rows: Miembro[]; pagina: number; cantidad: number; itemCounts: number; filters?: FilterInterface }
  | { type: "UPDATE_ITEM"; id: string; updateData: Miembro }
  | { type: "DELETE_ITEM"; id: string }
  | { type: "CREATE_ITEM"; newData: Miembro };

export const MiembroContext = createContext<{
  state: MiembroState;
  dispatch: React.Dispatch<MiembroActions>;
} | undefined>(undefined);

const miembroReducer = (
  state: MiembroState,
  action: MiembroActions
): MiembroState => {
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
        rows: state.rows.map(miembro =>
          miembro._id === action.id ? { ...miembro, ...action.updateData } : miembro
        ),
        updatedItem: !state.updatedItem
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        rows: state.rows.filter(miembro => miembro._id !== action.id),
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

export const MiembroContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: MiembroState = {
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

  const [state, dispatch] = useReducer(miembroReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        await getAllMiembros(cantidad, pagina, searchFor, orderBy, order)
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
  }, [dispatch, state.itemCounts,state.cantidad, state.pagina, state.filters, state.updatedItem]);

  return (
    <MiembroContext.Provider value={{ state, dispatch }}>
      {children}
    </MiembroContext.Provider>
  );
};

import { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Colaborador } from '../Models';
import { getAllColaboradores } from '../services';

interface FilterInterface {
  order?: string,
  orderBy?: string,
  searchFor?: string
}

interface ColaboradorState {
  rows: Colaborador[],
  cantidad: number,
  pagina: number,
  itemCounts: number,
  filters: FilterInterface,
  updatedItem: boolean
}

type ColaboradorActions =
  | { type: "SET_ITEM", rows: Colaborador[], pagina: number, cantidad: number, itemCounts: number, filters?: FilterInterface }
  | { type: "UPDATE_ITEM", id: string, updateData: Colaborador }
  | { type: "DELETE_ITEM", id: string }
  | { type: "CREATE_ITEM", newData: Colaborador }
  
export const ColaboradorContext = createContext<{ state: ColaboradorState, dispatch: React.Dispatch<ColaboradorActions> } | undefined>(undefined);

const colaboradorReducer = (state: ColaboradorState, action: ColaboradorActions): ColaboradorState => {
  switch (action.type) {
    case 'SET_ITEM':
      return {
        ...state,
        rows: action.rows,
        cantidad: action.cantidad,
        pagina: action.pagina,
        itemCounts: action.itemCounts,
        filters: action.filters || {} // Establecer los filtros o un objeto vacío si no se proporcionan
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        rows: state.rows.map(colaborador =>
          colaborador._id === action.id ? { ...colaborador, ...action.updateData } : colaborador
        ),
        updatedItem: !state.updatedItem
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        rows: state.rows.filter(colaborador => colaborador._id !== action.id),
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

export const ColaboradorContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: ColaboradorState = {
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
  }

  const [state, dispatch] = useReducer(colaboradorReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = state.filters;
        await getAllColaboradores(cantidad, pagina, searchFor, orderBy, order)
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
  }, [dispatch, state.itemCounts ,state.cantidad, state.pagina, state.filters, state.updatedItem]);

  return (
    <ColaboradorContext.Provider value={{ state, dispatch }}>
      {children}
    </ColaboradorContext.Provider>
  );
};

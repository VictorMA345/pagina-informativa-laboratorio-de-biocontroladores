import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { Servicio } from '../Models';
import { getAllServicios } from '../services';

interface FilterInterface {
  order?: string;
  orderBy?: string;
  searchFor?: string;
}

interface ServicioState {
  rows: Servicio[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  updatedItem: boolean;
  filters: FilterInterface; 
}

type ServicioActions =
  | { type: 'SET_ITEM'; rows: Servicio[]; pagina: number; cantidad: number; itemCounts: number; filters?: FilterInterface }
  | { type: 'UPDATE_ITEM'; id: string; updateData: Servicio }
  | { type: 'DELETE_ITEM'; id: string }
  | { type: 'CREATE_ITEM'; newData: Servicio };

export const ServicioContext = createContext<{
  state: ServicioState;
  dispatch: React.Dispatch<ServicioActions>;
} | undefined>(undefined);

const servicioReducer = (
  state: ServicioState,
  action: ServicioActions
): ServicioState => {
  switch (action.type) {
    case 'SET_ITEM':
      return {
        ...state,
        rows: action.rows,
        cantidad: action.cantidad,
        pagina: action.pagina,
        itemCounts: action.itemCounts,
        filters: action.filters || {},
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        rows: state.rows.map((servicio) =>
          servicio._id === action.id ? { ...servicio, ...action.updateData } : servicio
        ),
        updatedItem: !state.updatedItem,
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        rows: state.rows.filter((servicio) => servicio._id !== action.id),
        itemCounts: state.itemCounts - 1,
      };
    case 'CREATE_ITEM':
      return {
        ...state,
        rows: [...state.rows, action.newData],
        itemCounts: state.itemCounts + 1,
      };
    default:
      return state;
  }
};

export const ServicioContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: ServicioState = {
    rows: [],
    cantidad: 5,
    pagina: 1,
    itemCounts: 0,
    updatedItem: false,
    filters: {
      order: 'asc',
      orderBy: '',
      searchFor: '',
    },
  };

  const [state, dispatch] = useReducer(servicioReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        const data: any = await getAllServicios(cantidad, pagina, searchFor, orderBy, order);
        dispatch({
          type: 'SET_ITEM',
          rows: data.data,
          pagina,
          cantidad,
          itemCounts: data.itemCounts as number,
          filters,
        });
      } catch (error) {
        console.log('Error Fetching Data: ', error);
      }
    }

    fetchData();
  }, [dispatch, state.itemCounts ,state.cantidad, state.pagina, state.filters, state.updatedItem]);
  return (
    <ServicioContext.Provider value={{ state, dispatch }}>
      {children}
    </ServicioContext.Provider>
  );
};

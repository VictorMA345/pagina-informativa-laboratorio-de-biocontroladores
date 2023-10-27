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
  filters: FilterInterface; 
}

type ServicioActions = { 
    type: 'SET_ITEM';
    rows: Servicio[]; 
    pagina: number; 
    cantidad: number; 
    itemCounts: number; 
    filters?: FilterInterface }


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
    default:
      return state;
  }
};

export const ServicioContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: ServicioState = {
    rows: [],
    cantidad: 6,
    pagina: 1,
    itemCounts: 0,
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
  }, [state.itemCounts ,state.cantidad, state.pagina, state.filters]);
  return (
    <ServicioContext.Provider value={{ state, dispatch }}>
      {children}
    </ServicioContext.Provider>
  );
};

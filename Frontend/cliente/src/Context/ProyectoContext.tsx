import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { Proyecto } from '../Models';
import { getAllProyectos } from '../services';

interface FilterInterface {
  order?: string;
  orderBy?: string;
  searchFor?: string;
}

interface ProyectoState {
  rows: Proyecto[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  filters: FilterInterface; 
}

type ProyectoActions = { 
    type: 'SET_ITEM';
    rows: Proyecto[]; 
    pagina: number; 
    cantidad: number; 
    itemCounts: number; 
    filters?: FilterInterface }


export const ProyectoContext = createContext<{
  state: ProyectoState;
  dispatch: React.Dispatch<ProyectoActions>;
} | undefined>(undefined);

const ProyectoReducer = (
  state: ProyectoState,
  action: ProyectoActions
): ProyectoState => {
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

export const ProyectoContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: ProyectoState = {
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

  const [state, dispatch] = useReducer(ProyectoReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        const data: any = await getAllProyectos(cantidad, pagina, searchFor, orderBy, order);
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
    <ProyectoContext.Provider value={{ state, dispatch }}>
      {children}
    </ProyectoContext.Provider>
  );
};

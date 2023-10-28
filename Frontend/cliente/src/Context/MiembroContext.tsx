import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { Miembro } from '../Models';
import { getAllMiembros } from '../services';

interface FilterInterface {
  order?: string;
  orderBy?: string;
  searchFor?: string;
}

interface MiembroState {
  rows: Miembro[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  filters: FilterInterface; 
}

type MiembroActions = { 
    type: 'SET_ITEM';
    rows: Miembro[]; 
    pagina: number; 
    cantidad: number; 
    itemCounts: number; 
    filters?: FilterInterface }


export const MiembroContext = createContext<{
  state: MiembroState;
  dispatch: React.Dispatch<MiembroActions>;
} | undefined>(undefined);

const MiembroReducer = (
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
        filters: action.filters || {},
      };
    default:
      return state;
  }
};

export const MiembroContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: MiembroState = {
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

  const [state, dispatch] = useReducer(MiembroReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        const data: any = await getAllMiembros(cantidad, pagina, searchFor, orderBy, order);
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
    <MiembroContext.Provider value={{ state, dispatch }}>
      {children}
    </MiembroContext.Provider>
  );
};
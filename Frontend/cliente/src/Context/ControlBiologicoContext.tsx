import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { ControlBiologico } from '../Models';
import { getAllControlBiologico } from '../services';

interface FilterInterface {
  order?: string;
  orderBy?: string;
  searchFor?: string;
}

interface ControlBiologicoState {
  rows: ControlBiologico[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  filters: FilterInterface; 
}

type ControlBiologicoActions = { 
    type: 'SET_ITEM';
    rows: ControlBiologico[]; 
    pagina: number; 
    cantidad: number; 
    itemCounts: number; 
    filters?: FilterInterface 
}


export const ControlBiologicoContext = createContext<{
  state: ControlBiologicoState;
  dispatch: React.Dispatch<ControlBiologicoActions>;
} | undefined>(undefined);

const ControlBiologicoReducer = (
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
        filters: action.filters || {},
      };
    default:
      return state;
  }
};

export const ControlBiologicoContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: ControlBiologicoState = {
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

  const [state, dispatch] = useReducer(ControlBiologicoReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        const data: any = await getAllControlBiologico(cantidad, pagina, searchFor, orderBy, order);
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
  }, [state.cantidad, state.pagina, state.filters]);
  return (
    <ControlBiologicoContext.Provider value={{ state, dispatch }}>
      {children}
    </ControlBiologicoContext.Provider>
  );
};

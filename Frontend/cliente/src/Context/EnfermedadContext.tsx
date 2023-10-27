import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { Enfermedad } from '../Models';
import { getAllEnfermedad } from '../services';

interface FilterInterface {
  order?: string;
  orderBy?: string;
  searchFor?: string;
}

interface EnfermedadState {
  rows: Enfermedad[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  filters: FilterInterface; 
}

type EnfermedadActions = { 
    type: 'SET_ITEM';
    rows: Enfermedad[]; 
    pagina: number; 
    cantidad: number; 
    itemCounts: number; 
    filters?: FilterInterface 
}


export const EnfermedadContext = createContext<{
  state: EnfermedadState;
  dispatch: React.Dispatch<EnfermedadActions>;
} | undefined>(undefined);

const EnfermedadReducer = (
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
        filters: action.filters || {},
      };
    default:
      return state;
  }
};

export const EnfermedadContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: EnfermedadState = {
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

  const [state, dispatch] = useReducer(EnfermedadReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        const data: any = await getAllEnfermedad(cantidad, pagina, searchFor, orderBy, order);
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
  }, [dispatch, state.itemCounts ,state.cantidad, state.pagina, state.filters]);
  return (
    <EnfermedadContext.Provider value={{ state, dispatch }}>
      {children}
    </EnfermedadContext.Provider>
  );
};

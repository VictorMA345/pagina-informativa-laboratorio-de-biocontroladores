import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { Tesis } from '../Models';
import { getAllTesis } from '../services';

interface FilterInterface {
  order?: string;
  orderBy?: string;
  searchFor?: string;
}

interface TesisState {
  rows: Tesis[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  filters: FilterInterface; 
}

type TesisActions = { 
    type: 'SET_ITEM';
    rows: Tesis[]; 
    pagina: number; 
    cantidad: number; 
    itemCounts: number; 
    filters?: FilterInterface }


export const TesisContext = createContext<{
  state: TesisState;
  dispatch: React.Dispatch<TesisActions>;
} | undefined>(undefined);

const TesisReducer = (
  state: TesisState,
  action: TesisActions
): TesisState => {
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

export const TesisContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: TesisState = {
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

  const [state, dispatch] = useReducer(TesisReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        const data: any = await getAllTesis(cantidad, pagina, searchFor, orderBy, order);
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
    <TesisContext.Provider value={{ state, dispatch }}>
      {children}
    </TesisContext.Provider>
  );
};

import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { Colaborador } from '../Models';
import { getAllColaboradores } from '../services';

interface FilterInterface {
  order?: string;
  orderBy?: string;
  searchFor?: string;
}

interface ColaboradorState {
  rows: Colaborador[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  filters: FilterInterface; 
}

type ColaboradorActions = { 
    type: 'SET_ITEM';
    rows: Colaborador[]; 
    pagina: number; 
    cantidad: number; 
    itemCounts: number; 
    filters?: FilterInterface 
  }


export const ColaboradorContext = createContext<{
  state: ColaboradorState;
  dispatch: React.Dispatch<ColaboradorActions>;
} | undefined>(undefined);

const ColaboradorReducer = (
  state: ColaboradorState,
  action: ColaboradorActions
): ColaboradorState => {
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

export const ColaboradorContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: ColaboradorState = {
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

  const [state, dispatch] = useReducer(ColaboradorReducer, estadoInicial);


  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        const data: any = await getAllColaboradores(cantidad, pagina, searchFor, orderBy, order);
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
    <ColaboradorContext.Provider value={{ state, dispatch }}>
      {children}
    </ColaboradorContext.Provider>
  );
};

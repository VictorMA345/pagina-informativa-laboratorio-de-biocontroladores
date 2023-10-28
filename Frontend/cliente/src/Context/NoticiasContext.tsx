import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { Noticia } from '../Models';
import { getAllNoticias } from '../services';

interface FilterInterface {
  order?: string;
  orderBy?: string;
  searchFor?: string;
}

interface NoticiaState {
  rows: Noticia[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  filters: FilterInterface; 
}

type NoticiaActions = { 
    type: 'SET_ITEM';
    rows: Noticia[]; 
    pagina: number; 
    cantidad: number; 
    itemCounts: number; 
    filters?: FilterInterface 
}


export const NoticiaContext = createContext<{
  state: NoticiaState;
  dispatch: React.Dispatch<NoticiaActions>;
} | undefined>(undefined);

const NoticiaReducer = (
  state: NoticiaState,
  action: NoticiaActions
): NoticiaState => {
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

export const NoticiaContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: NoticiaState = {
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

  const [state, dispatch] = useReducer(NoticiaReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        const data: any = await getAllNoticias(cantidad, pagina, searchFor, orderBy, order);
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
    <NoticiaContext.Provider value={{ state, dispatch }}>
      {children}
    </NoticiaContext.Provider>
  );
};

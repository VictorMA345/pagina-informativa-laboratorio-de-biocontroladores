import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { Noticia } from '../Models';
import { getAllNoticias } from '../services';
import { useRef } from 'react'
function deepEqual(object1: any, object2: any): boolean {
  if (typeof object1 !== typeof object2) {
    return false;
  }
  if (typeof object1 !== 'object' || object1 === null || object2 === null) {
    return object1 === object2;
  }
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(object1[key], object2[key])) {
      return false;
    }
  }
  return true;
}
interface FilterInterface {
  order?: string;
  orderBy?: string;
  searchFor?: string;
  startDate?: string;
  endDate?: string;
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
      startDate: '',
      endDate: '',
    },
  };

  const [state, dispatch] = useReducer(NoticiaReducer, estadoInicial);
  const cantidadRef = useRef(state.cantidad);
  const paginaRef = useRef(state.pagina);
  const filtersRef = useRef(state.filters);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters: newFilters } = state;
        const { order, orderBy, searchFor, startDate, endDate } = newFilters;

        if (
          cantidad !== cantidadRef.current ||
          pagina !== paginaRef.current ||
          !deepEqual(newFilters, filtersRef.current)
        ) {
          cantidadRef.current = cantidad;
          paginaRef.current = pagina;
          filtersRef.current = { ...newFilters };

          const data = await getAllNoticias(
            cantidad,
            pagina,
            searchFor,
            orderBy,
            order,
            startDate,
            endDate
          );
          dispatch({
            type: 'SET_ITEM',
            rows: data.data,
            pagina,
            cantidad,
            itemCounts: data.itemCounts as number,
            filters: newFilters,
          });
        }
      } catch (error) {
        console.log('Error Fetching Data: ', error);
      }
    }

    fetchData();
  }, [dispatch, state.pagina, state.filters]);

  return (
    <NoticiaContext.Provider value={{ state, dispatch }}>
      {children}
    </NoticiaContext.Provider>
  );
};
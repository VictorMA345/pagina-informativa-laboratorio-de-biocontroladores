import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { Noticia } from '../Models';
import { getAllNoticias } from '../services';

interface FilterInterface {
  order?: string,
  orderBy?: string,
  searchFor?: string
}

interface NoticiaState {
  rows: Noticia[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  updatedItem: boolean;
  filters: FilterInterface; // Agregar el objeto de filtros aquí
}

type NoticiaActions =
  | { type: 'SET_ITEM'; rows: Noticia[]; pagina: number; cantidad: number; itemCounts: number; filters?: FilterInterface }
  | { type: 'UPDATE_ITEM'; id: string; updateData: Noticia }
  | { type: 'DELETE_ITEM'; id: string }
  | { type: 'CREATE_ITEM'; newData: Noticia };

export const NoticiaContext = createContext<{
  state: NoticiaState;
  dispatch: React.Dispatch<NoticiaActions>;
} | undefined>(undefined);

const noticiaReducer = (
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
        filters: action.filters || {}
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        rows: state.rows.map((noticia) =>
          noticia._id === action.id ? { ...noticia, ...action.updateData } : noticia
        ),
        updatedItem: !state.updatedItem,
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        rows: state.rows.filter((noticia) => noticia._id !== action.id),
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

export const NoticiaContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: NoticiaState = {
    rows: [],
    cantidad: 5,
    pagina: 1,
    itemCounts: 0,
    updatedItem: false,
    filters: {
      order: "asc",
      orderBy: "",
      searchFor: ""
    }
  };

  const [state, dispatch] = useReducer(noticiaReducer, estadoInicial);

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
          filters
        });
      } catch (error) {
        console.log('Error Fetching Data: ', error);
      }
    }

    fetchData();
  }, [dispatch, state.itemCounts,state.cantidad, state.pagina, state.filters, state.updatedItem]);

  return (
    <NoticiaContext.Provider value={{ state, dispatch }}>
      {children}
    </NoticiaContext.Provider>
  );
};

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
  updatedItem: boolean;
  filters: FilterInterface;
}

type TesisActions =
  | { type: 'SET_ITEM'; rows: Tesis[]; pagina: number; cantidad: number; itemCounts: number; filters?: FilterInterface }
  | { type: 'UPDATE_ITEM'; id: string; updateData: Tesis }
  | { type: 'DELETE_ITEM'; id: string }
  | { type: 'CREATE_ITEM'; newData: Tesis };

export const TesisContext = createContext<{ state: TesisState; dispatch: React.Dispatch<TesisActions> } | undefined>(
  undefined
);

const tesisReducer = (state: TesisState, action: TesisActions): TesisState => {
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
    case 'UPDATE_ITEM':
      return {
        ...state,
        rows: state.rows.map((tesis) =>
          tesis._id === action.id ? { ...tesis, ...action.updateData } : tesis
        ),
        updatedItem: !state.updatedItem,
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        rows: state.rows.filter((tesis) => tesis._id !== action.id),
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

export const TesisContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: TesisState = {
    rows: [],
    cantidad: 5,
    pagina: 1,
    itemCounts: 0,
    updatedItem: false,
    filters: {
      order: 'asc',
      orderBy: '',
      searchFor: '',
    },
  };

  const [state, dispatch] = useReducer(tesisReducer, estadoInicial);

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
  }, [dispatch, state.cantidad, state.pagina, state.filters, state.updatedItem]);

  return (
    <TesisContext.Provider value={{ state, dispatch }}>
      {children}
    </TesisContext.Provider>
  );
};

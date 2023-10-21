import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { Proyecto } from '../Models'; 
import { getAllProyectos } from '../services';

interface FilterInterface {
  order?: string,
  orderBy?: string,
  searchFor?: string
}

interface ProyectoState {
  rows: Proyecto[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  updatedItem: boolean;
  filters: FilterInterface; 
}

type ProyectoActions =
  | { type: 'SET_ITEM'; rows: Proyecto[]; pagina: number; cantidad: number; itemCounts: number; filters?: FilterInterface }
  | { type: 'UPDATE_ITEM'; id: string; updateData: Proyecto }
  | { type: 'DELETE_ITEM'; id: string }
  | { type: 'CREATE_ITEM'; newData: Proyecto };

export const ProyectoContext = createContext<{
  state: ProyectoState;
  dispatch: React.Dispatch<ProyectoActions>;
} | undefined>(undefined);

const proyectoReducer = (
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
        filters: action.filters || {}
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        rows: state.rows.map((proyecto) =>
          proyecto._id === action.id ? { ...proyecto, ...action.updateData } : proyecto
        ),
        updatedItem: !state.updatedItem,
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        rows: state.rows.filter((proyecto) => proyecto._id !== action.id),
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

export const ProyectoContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: ProyectoState = {
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

  const [state, dispatch] = useReducer(proyectoReducer, estadoInicial);

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
          filters
        });
      } catch (error) {
        console.log('Error Fetching Data: ', error);
      }
    }

    fetchData();
  }, [dispatch, state.itemCounts,state.cantidad, state.pagina, state.filters, state.updatedItem]);

  return (
    <ProyectoContext.Provider value={{ state, dispatch }}>
      {children}
    </ProyectoContext.Provider>
  );
};

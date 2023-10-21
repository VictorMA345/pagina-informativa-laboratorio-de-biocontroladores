import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { Rol } from '../Models'; // Asegúrate de tener una importación adecuada para el modelo de Rol.
import { getAllRoles } from '../services'; // Asegúrate de tener una función similar para obtener todos los roles.

interface FilterInterface {
  order?: string;
  orderBy?: string;
  searchFor?: string;
}

interface RolState {
  rows: Rol[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  updatedItem: boolean;
  filters: FilterInterface;
}

type RolActions =
  | { type: 'SET_ITEM'; rows: Rol[]; pagina: number; cantidad: number; itemCounts: number; filters?: FilterInterface }
  | { type: 'UPDATE_ITEM'; id: string; updateData: Rol }
  | { type: 'DELETE_ITEM'; id: string }
  | { type: 'CREATE_ITEM'; newData: Rol };

export const RolContext = createContext<{
  state: RolState;
  dispatch: React.Dispatch<RolActions>;
} | undefined>(undefined);

const rolReducer = (state: RolState, action: RolActions): RolState => {
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
        rows: state.rows.map((rol) =>
          rol._id === action.id ? { ...rol, ...action.updateData } : rol
        ),
        updatedItem: !state.updatedItem,
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        rows: state.rows.filter((rol) => rol._id !== action.id),
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

export const RolContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialState: RolState = {
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

  const [state, dispatch] = useReducer(rolReducer, initialState);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        const data: any = await getAllRoles(cantidad, pagina, searchFor, orderBy, order);
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
  }, [dispatch, state.itemCounts, state.cantidad, state.pagina, state.filters, state.updatedItem]);

  return (
    <RolContext.Provider value={{ state, dispatch }}>
      {children}
    </RolContext.Provider>
  );
};

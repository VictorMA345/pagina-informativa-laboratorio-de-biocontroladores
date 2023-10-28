import { ReactNode, useReducer, createContext, useEffect } from 'react';
import { Estudiante } from '../Models';
import { getAllEstudiantes } from '../services';

interface FilterInterface {
  order?: string;
  orderBy?: string;
  searchFor?: string;
}

interface EstudianteState {
  rows: Estudiante[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  filters: FilterInterface; 
}

type EstudianteActions = { 
    type: 'SET_ITEM';
    rows: Estudiante[]; 
    pagina: number; 
    cantidad: number; 
    itemCounts: number; 
    filters?: FilterInterface 
}


export const EstudianteContext = createContext<{
  state: EstudianteState;
  dispatch: React.Dispatch<EstudianteActions>;
} | undefined>(undefined);

const EstudianteReducer = (
  state: EstudianteState,
  action: EstudianteActions
): EstudianteState => {
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

export const EstudianteContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: EstudianteState = {
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

  const [state, dispatch] = useReducer(EstudianteReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        const data: any = await getAllEstudiantes(cantidad, pagina, searchFor, orderBy, order);
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
    <EstudianteContext.Provider value={{ state, dispatch }}>
      {children}
    </EstudianteContext.Provider>
  );
};

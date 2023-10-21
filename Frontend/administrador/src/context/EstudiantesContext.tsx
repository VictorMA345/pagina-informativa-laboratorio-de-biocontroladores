import { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Estudiante } from '../Models';
import { getAllEstudiantes } from '../services';

interface FilterInterface {
  order?: string,
  orderBy?: string,
  searchFor?: string
}

interface EstudianteState {
  rows: Estudiante[];
  cantidad: number;
  pagina: number;
  itemCounts: number;
  updatedItem: boolean;
  filters: FilterInterface; 
}

type EstudianteActions =
  | { type: "SET_ITEM"; rows: Estudiante[]; pagina: number; cantidad: number; itemCounts: number; filters?: FilterInterface }
  | { type: "UPDATE_ITEM"; id: string; updateData: Estudiante }
  | { type: "DELETE_ITEM"; id: string }
  | { type: "CREATE_ITEM"; newData: Estudiante };

export const EstudiantesContext = createContext<{
  state: EstudianteState;
  dispatch: React.Dispatch<EstudianteActions>;
} | undefined>(undefined);

const estudiantesReducer = (
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
        filters: action.filters || {}
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        rows: state.rows.map(estudiante =>
          estudiante._id === action.id ? { ...estudiante, ...action.updateData } : estudiante
        ),
        updatedItem: !state.updatedItem
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        rows: state.rows.filter(estudiante => estudiante._id !== action.id),
        itemCounts: state.itemCounts - 1
      };
    case 'CREATE_ITEM':
      return {
        ...state,
        rows: [...state.rows, action.newData],
        itemCounts: state.itemCounts + 1
      };
    default:
      return state;
  }
};

export const EstudiantesContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const estadoInicial: EstudianteState = {
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

  const [state, dispatch] = useReducer(estudiantesReducer, estadoInicial);

  useEffect(() => {
    async function fetchData() {
      try {
        const { cantidad, pagina, filters } = state;
        const { order, orderBy, searchFor } = filters;
        await getAllEstudiantes(cantidad, pagina, searchFor, orderBy, order)
          .then((data) => {
            dispatch({
              type: 'SET_ITEM',
              rows: data.data,
              pagina,
              cantidad,
              itemCounts: data.itemCounts as number,
              filters
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log("Error Fetching Data: ", error);
      }
    }
    fetchData();
  }, [dispatch, state.itemCounts,state.cantidad, state.pagina, state.filters, state.updatedItem]);

  return (
    <EstudiantesContext.Provider value={{ state, dispatch }}>
      {children}
    </EstudiantesContext.Provider>
  );
};

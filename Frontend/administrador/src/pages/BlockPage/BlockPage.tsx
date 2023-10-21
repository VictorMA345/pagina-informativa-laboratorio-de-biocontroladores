import './BlockPage.css'

export const BlockPage = () => {
    return (
        <div className="no-permission-notice">
          <div className="no-permission-content">
            <h2>No tienes permisos para acceder a este módulo.</h2>
            <p>
              Por favor, ponte en contacto con el administrador para obtener los
              permisos necesarios.
            </p>
          </div>
        </div>
      );
  };
  
  export default BlockPage;
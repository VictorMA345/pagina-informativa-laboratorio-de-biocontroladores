import './Home.css';

export const Home = () => {
  return (
    <>
    <div className="Homepage">
      <div className="intro">
        <h2>¡Bienvenido al panel de control del Laboratorio de Biocontroladores!</h2>
        <p>
          En nuestro laboratorio, estamos comprometidos con la promoción de la agricultura sostenible
          y ofrecemos una variedad de servicios y recursos para ayudarte a lograrlo.
        </p>
        <p>
          Aquí encontrarás información sobre nuestros servicios destacados, noticias y recursos
          relacionados con la agricultura, así como la posibilidad de ponerte en contacto con nosotros.
        </p>
      </div>

      <div className="instructions">
        <h2>¿Cómo Usar Esta Página?</h2>
        <p>
          - Si tienes permisos para gestionar miembros, dirígete al módulo "Miembros". Aquí, puedes agregar, editar y eliminar cuentas de usuario según sea necesario.
        </p>
        <p>
          - En el menú lateral izquierdo, verás una lista de módulos disponibles. Cada módulo representa una sección diferente de la aplicación. Haz clic en un módulo para acceder a sus funciones específicas.
        </p>
        <p>
          - ¡Explora los diferentes módulos y disfruta de la experiencia de utilizar nuestro Panel de Control! Siempre estamos aquí para ayudarte, así que no dudes en ponerte en contacto si necesitas asistencia.
        </p>
      </div>
    </div>

    </>
  );
};

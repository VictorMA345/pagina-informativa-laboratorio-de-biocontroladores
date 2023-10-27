import { Container } from 'react-bootstrap'
import './NoResultsLabel.css'
export const NoResultsLabel = () => {
  return (
    <Container className='no-results-container'>

        <span className='no-results-label'>
            ¡No se encontraron resultados! Pruebe con otra búsqueda
        </span>
    </Container>
  )
}

import { Container } from 'react-bootstrap'
import './NoResultsLabel.css'
import { useTranslation } from 'react-i18next'
export const NoResultsLabel = () => {
  const { t } = useTranslation();
  return (
    <Container className='no-results-container'>

        <span className='no-results-label'>
            {t('no_resultados')}
        </span>
    </Container>
  )
}

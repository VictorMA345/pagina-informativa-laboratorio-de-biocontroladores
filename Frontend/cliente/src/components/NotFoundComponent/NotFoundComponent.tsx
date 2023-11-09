import './NotFoundComponent.css'
import {useTranslation} from 'react-i18next'
export const NotFoundComponent = () => {
    const { t } = useTranslation();
    return (
      <div className="not-found">
        <h1 className="not-found-heading">404 - {t('pagina_no_encontrada')}</h1>
        <p className="not-found-text">{t('pagina_no_existe')}</p>
      </div>
    );
  };
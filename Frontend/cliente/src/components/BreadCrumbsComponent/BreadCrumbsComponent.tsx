import React from 'react'
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./BreadCrumbsComponent.css"
import { useTranslation } from 'react-i18next'
interface BreadcrumbsProps {
  mainSection: string;
  itemSection: string;
  itemId: string;
}
export const BreadCrumbsComponent:React.FC<BreadcrumbsProps> = ({mainSection,itemSection,itemId}) => {
  const { t }  = useTranslation();
  return (
    <Breadcrumb className='breadcrumbs-component'>
      <Breadcrumb.Item>
      <Link 
        to = "/"
        className='breadcrumbs-link'
      > 
        {t('pagina_principal')}
      </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link
          className='breadcrumbs-link'
          to = {`/${mainSection}`}> 
          {t(mainSection)}
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link
          className='breadcrumbs-link'
          to = {`/${mainSection}/${itemId}`} > 
        {itemSection}
        </Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  )
}

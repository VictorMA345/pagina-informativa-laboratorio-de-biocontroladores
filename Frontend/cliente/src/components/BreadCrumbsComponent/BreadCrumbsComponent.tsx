import React from 'react'
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./BreadCrumbsComponent.css"
interface BreadcrumbsProps {
  mainSection: string;
  itemSection: string;
  itemId: string;
}
export const BreadCrumbsComponent:React.FC<BreadcrumbsProps> = ({mainSection,itemSection,itemId}) => {
  return (
    <Breadcrumb className='breadcrumbs-component'>
      <Breadcrumb.Item>
      <Link 
        to = "/"
        className='breadcrumbs-link'
      > 
        Página Principal 
      </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link
          className='breadcrumbs-link'
          to = {`/${mainSection}`}> 
          {mainSection.charAt(0).toUpperCase() + mainSection.slice(1)}
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

import React from "react"
import { Carrousel,MainPageMiddleContainer,MapComponent,SectionLabel } from "../components"
import { ControlBiologico,Enfermedad,Noticia } from "../Models"
interface HomeProps {
  setItem : React.Dispatch<React.SetStateAction<ControlBiologico | Enfermedad | Noticia | undefined>>;
  generalInfo : any;
}
import { useTranslation } from 'react-i18next'
export const Home: React.FC<HomeProps> = ({setItem,generalInfo}) => {
  const { t } = useTranslation();
  return (
    <>
    <MainPageMiddleContainer 
      setItem = {setItem as React.Dispatch<React.SetStateAction<Noticia | undefined>>}
      generalInfo = {generalInfo}
    />
    <hr />
    <Carrousel 
      setItem={setItem as React.Dispatch<React.SetStateAction<ControlBiologico | Enfermedad | undefined>>}
    />
    <SectionLabel 
      label = {t('ubication')}
    />
    <hr/>
    <MapComponent />
    </>
  )
}

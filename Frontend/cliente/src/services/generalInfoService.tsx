export const getGeneralInfo = async () => {
    let apiUrl = `http://localhost:3000/api/informacion`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};
let ignore = false
export const increaseView = async() =>{
  let apiUrl = `http://localhost:3000/api/informacion/increase-view`;
  if(!ignore) {
    ignore = true
    await fetch(apiUrl);
  }
}
// interface para tipar las props del componente Producto
interface ProductoProps {
  nombre: string
  precio: number
  stock: number
  oferta?: boolean // el ? hace que sea opcional
}

function Producto({ nombre, precio, stock, oferta }: ProductoProps) {
  return (
    <div className="tarjeta">
      <h3>{nombre}</h3>
      {oferta && <p className="oferta">¡Oferta!</p>}
      <p>Precio: ${precio}</p>
      <p>{stock === 0 ? 'Sin stock' : `Stock: ${stock}`}</p>
    </div>
  )
}

export default function Ej7() {
  return (
    <div className="fila">
      <Producto nombre="Mouse" precio={5000} stock={3} />
      <Producto nombre="Teclado" precio={12000} stock={4} oferta />
      <Producto nombre="Monitor" precio={150000} stock={0} />
    </div>
  )
}

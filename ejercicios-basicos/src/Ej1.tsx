// Componente que muestra una tarjeta de producto.
// Recibe nombre, precio y stock como props.
function Producto({ nombre, precio, stock }: { nombre: string; precio: number; stock: number }) {
  return (
    <div className="tarjeta">
      <h3>{nombre}</h3>
      <p>Precio: ${precio}</p>
      {/* si no hay stock muestro "Sin stock", si hay muestro la cantidad */}
      <p>{stock === 0 ? 'Sin stock' : `Stock: ${stock}`}</p>
    </div>
  )
}

export default function Ej1() {
  return (
    <div className="fila">
      <Producto nombre="Mouse" precio={5000} stock={3} />
      <Producto nombre="Teclado" precio={12000} stock={0} />
      <Producto nombre="Monitor" precio={150000} stock={7} />
    </div>
  )
}

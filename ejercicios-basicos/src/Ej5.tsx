import { useState } from 'react'

interface Item {
  id: number
  texto: string
}

export default function Ej5() {
  const [texto, setTexto] = useState('')
  const [items, setItems] = useState<Item[]>([])

  function agregar() {
    // no se deja agregar ítems vacíos
    if (texto.trim() === '') return
    // se crea un array nuevo con lo que había, más el nuevo ítem
    setItems([...items, { id: Date.now(), texto: texto.trim() }])
    setTexto('')
  }

  function eliminar(id: number) {
    // me quedo con todos menos el que quiero borrar
    setItems(items.filter((i) => i.id !== id))
  }

  return (
    <div className="tarjeta">
      <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ej: pan" />
      <button onClick={agregar}>Agregar</button>

      {items.length === 0 ? (
        <p>No hay nada para comprar</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.texto} <button onClick={() => eliminar(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

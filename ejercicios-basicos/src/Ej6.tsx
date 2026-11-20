import { useState } from 'react'

const lenguajes = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Kotlin', 'Swift']

export default function Ej6() {
  const [busqueda, setBusqueda] = useState('')

  // se pasa todo a minúsculas para que no importe cómo se escribe para buscar
  const resultados = lenguajes.filter((l) => l.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div className="tarjeta">
      <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar lenguaje..." />
      <p>{resultados.length} resultados</p>
      <ul>
        {resultados.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  )
}

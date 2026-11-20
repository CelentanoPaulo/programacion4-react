import { useState } from 'react'

export default function Ej2() {
  // se guarda el valor del contador, arranca en 0
  const [valor, setValor] = useState(0)

  function restar() {
    if (valor > 0) setValor(valor - 1)
  }

  function sumar() {
    if (valor < 10) setValor(valor + 1)
  }

  return (
    <div className="tarjeta">
      <h3>{valor}</h3>
      {/* los botones se deshabilitan cuando llego al límite */}
      <button onClick={restar} disabled={valor === 0}>-</button>
      <button onClick={sumar} disabled={valor === 10}>+</button>
      <button onClick={() => setValor(0)}>Reiniciar</button>
    </div>
  )
}

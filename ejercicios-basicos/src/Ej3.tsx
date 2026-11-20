import { useState } from 'react'

export default function Ej3() {
  // true = la respuesta se ve, false = está oculta
  const [visible, setVisible] = useState(false)

  return (
    <div className="tarjeta">
      <h3>¿Qué hook se usa para guardar estado en React?</h3>
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'Ocultar respuesta' : 'Mostrar respuesta'}
      </button>
      {/* la respuesta solo se muestra si visible es true */}
      {visible && <p>useState</p>}
    </div>
  )
}

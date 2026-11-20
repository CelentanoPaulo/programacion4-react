import { useState } from 'react'

export default function Ej4() {
  // se guarda lo que se escribe en el input (siempre es texto)
  const [celsius, setCelsius] = useState('')

  // fahrenheit no es estado, se calcula a partir de celsius en cada render
  const fahrenheit = (Number(celsius) * 9) / 5 + 32

  return (
    <div className="tarjeta">
      <label>
        Celsius:{' '}
        <input type="number" value={celsius} onChange={(e) => setCelsius(e.target.value)} />
      </label>
      <p>Fahrenheit: {fahrenheit}</p>
      {Number(celsius) > 30 && <p>Hace calor</p>}
    </div>
  )
}

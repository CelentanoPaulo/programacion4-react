import { useState } from "react";
import type { SubmitEvent } from "react";
import { UserList } from "./UserList";

export default function App() {
  //bajo capot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  // paso 7: el token arranca con lo que haya guardado en localStorage
  const [token, setToken] = useState(localStorage.getItem("token"));

  async function handleSubmit(evento: SubmitEvent) {
    evento?.preventDefault();
    setError(null);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.detail);
      return;
    }
    // paso 7: guardo el token para que no se pierda al recargar
    localStorage.setItem("token", data.token);
    setToken(data.token);
  }

  // paso 7: cierro la sesión
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  // práctica 8: UserList me avisa con esta función cuando la API responde 401
  function sesionVencida() {
    logout();
    setError("Tu sesión venció");
  }

  //carroceria
  if (token) {
    return (
      <>
        <button onClick={logout}>Salir</button>
        <UserList token={token} onUnauthorized={sesionVencida} />
      </>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Ingresar</button>
      {error && <p>{error}</p>}
    </form>
  );
}

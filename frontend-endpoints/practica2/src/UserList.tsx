import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

// práctica 1: lo que devuelve GET /user/{id}
interface UserDetail extends User {
  email: string;
  age: number;
  country: { name: string } | null;
  roles: { name: string }[];
}

export function UserList({ token }: { token: string }) {
  //bajo capot
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<User | null>(null); // paso 6
  const [selectedId, setSelectedId] = useState<number | null>(null); // práctica 1
  const [detail, setDetail] = useState<UserDetail | null>(null); // práctica 1
  const [loading, setLoading] = useState(true); // práctica 2

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      const data = await respuesta.json();
      setLoading(false); // práctica 2: ya llegó la respuesta, buena o mala
      if (!respuesta.ok) {
        setError(data.detail); // 401, 403…: viene un objeto { detail }
        return;
      }
      setUsers(data); // 200: recién acá es una lista
    });
  }, [token]);

  // paso 6: primero pregunto quién soy y después pido mis datos
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    const api = import.meta.env.VITE_API_URL;
    fetch(`${api}/user/me/id`, { headers })
      .then((respuesta) => respuesta.json())
      .then(({ id }) => fetch(`${api}/user/${id}`, { headers }))
      .then((respuesta) => respuesta.json())
      .then(setMe);
  }, [token]);

  // práctica 1: cada vez que cambia el id elegido, pido el detalle
  useEffect(() => {
    if (selectedId === null) return;
    fetch(`${import.meta.env.VITE_API_URL}/user/${selectedId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      const data = await respuesta.json();
      if (!respuesta.ok) {
        setError(data.detail);
        return;
      }
      setDetail(data);
    });
  }, [selectedId, token]);

  //carroceria
  return (
    <>
      <h1>Hola, {me?.name}</h1>

      {/* práctica 2: mientras carga muestro "Cargando...", si hay error muestro el detail y si no, la lista */}
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id} onClick={() => setSelectedId(user.id)}>
              {user.name}
            </li>
          ))}
        </ul>
      )}

      {detail && (
        <div>
          <p>Email: {detail.email}</p>
          <p>Edad: {detail.age}</p>
          <p>País: {detail.country?.name}</p>
          <p>Roles: {detail.roles.map((rol) => rol.name).join(", ")}</p>
        </div>
      )}
    </>
  );
}

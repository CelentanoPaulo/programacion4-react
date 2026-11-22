import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";

interface User {
  id: number;
  name: string;
}

//lo que devuelve GET /user/{id}
interface UserDetail extends User {
  email: string;
  age: number;
  country: { name: string } | null;
  roles: { name: string }[];
}

//además del token, recibo la función que avisa a App que la sesión venció
export function UserList({
  token,
  onUnauthorized,
}: {
  token: string;
  onUnauthorized: () => void;
}) {
  //bajo capot
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<UserDetail | null>(null); //práctica 4: ahora con roles
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState(""); // lo que escribo en el input
  const [filtro, setFiltro] = useState(""); //lo que se busca de verdad
  //campos del formulario de alta
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pais, setPais] = useState("1");
  const [soloMayores, setSoloMayores] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null); // prácticas 5 y 7: errores del alta y del borrado

  useEffect(() => {
    // si hay algo buscado uso el endpoint de búsqueda, si no la lista completa
    let url = `${import.meta.env.VITE_API_URL}/user`;
    if (filtro !== "") {
      url = `${import.meta.env.VITE_API_URL}/user/search/${encodeURIComponent(filtro)}`;
    } else if (soloMayores) {
      url = `${import.meta.env.VITE_API_URL}/user_mayores`;
    }
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      if (respuesta.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await respuesta.json();
      setLoading(false); // ya llegó la respuesta, buena o mala
      if (!respuesta.ok) {
        setError(data.detail); // 401, 403… viene un objeto { detail }
        return;
      }
      setUsers(data); // 200 recién acá es una lista
    });
  }, [token, filtro, soloMayores, onUnauthorized]);

  //  primero pregunto quién soy y después pido mis datos
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    const api = import.meta.env.VITE_API_URL;
    fetch(`${api}/user/me/id`, { headers })
      .then((respuesta) => {
        if (respuesta.status === 401) onUnauthorized();
        return respuesta.json();
      })
      .then(({ id }) => fetch(`${api}/user/${id}`, { headers }))
      .then((respuesta) => respuesta.json())
      .then(setMe);
  }, [token, onUnauthorized]);

  //cada vez que cambia el id elegido, pido el detalle
  useEffect(() => {
    if (selectedId === null) return;
    fetch(`${import.meta.env.VITE_API_URL}/user/${selectedId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      if (respuesta.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await respuesta.json();
      if (!respuesta.ok) {
        setError(data.detail);
        return;
      }
      setDetail(data);
    });
  }, [selectedId, token, onUnauthorized]);

  // práctica 3
  function buscar() {
    setLoading(true);
    setError(null);
    setFiltro(busqueda);
  }

  function limpiar() {
    setLoading(true);
    setError(null);
    setBusqueda("");
    setFiltro("");
  }

  // alterno entre todos y solo mayores
  function cambiarFiltro() {
    setLoading(true);
    setError(null);
    setSoloMayores(!soloMayores);
  }

  //creo el usuario con POST /user
  async function crearUsuario(evento: SubmitEvent) {
    evento.preventDefault();
    setMensaje(null);
    const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: nombre,
        age: Number(edad), // obligo a que sea un numero
        email,
        password,
        country_id: Number(pais),
      }),
    });
    if (respuesta.status === 401) {
      onUnauthorized();
      return;
    }
    const data = await respuesta.json();
    if (!respuesta.ok) {
      setMensaje(data.detail); // con sfer: Missing permission: write_users
      return;
    }
    // la API devuelve { id }: lo agrego a la lista sin volver a pedirla
    setUsers([...users, { id: data.id, name: nombre }]);
  }

  //borro un usuario con DELETE /user/{id}
  function borrar(id: number) {
    if (!window.confirm("¿Seguro que querés borrar este usuario?")) return;
    setMensaje(null);
    fetch(`${import.meta.env.VITE_API_URL}/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      if (respuesta.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await respuesta.json();
      if (!respuesta.ok) {
        setMensaje(data.detail); // con sfer: Missing permission: delete_users
        return;
      }
      // lo saco de la lista sin volver a pedirla
      setUsers(users.filter((user) => user.id !== id));
    });
  }

  //carroceria
  return (
    <>
      {/*muestro mis roles separados por coma */}
      <h1>
        Hola, {me?.name} ({me?.roles?.map((rol) => rol.name).join(", ")})
      </h1>

      {/* práctica 3 */}
      <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      <button onClick={buscar}>Buscar</button>
      <button onClick={limpiar}>Limpiar</button>

      {/* práctica 6 */}
      <button onClick={cambiarFiltro}>
        {soloMayores ? "Todos" : "Solo mayores"}
      </button>

      {/* práctica 5 */}
      <form onSubmit={crearUsuario}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          minLength={4}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={pais} onChange={(e) => setPais(e.target.value)}>
          <option value="1">Argentina</option>
          <option value="2">Brasil</option>
        </select>
        <button type="submit">Crear</button>
      </form>
      {mensaje && <p>{mensaje}</p>}

      {/*mientras carga muestro "Cargando...", si hay error muestro el detail y si no, la lista */}
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id} onClick={() => setSelectedId(user.id)}>
              {user.name}{" "}
              {/*stopPropagation para que el clic en Borrar no abra el detalle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  borrar(user.id);
                }}
              >
                Borrar
              </button>
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

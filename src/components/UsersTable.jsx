import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/usersServices";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "user",
    password: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    username: "",
    password: "",
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data || []);
    } catch (error) {
      toast.error(error.message || "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      await loadUsers();
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("¿Eliminar usuario?");

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      setUsers((prev) =>
        prev.filter(
          (user) => user.id_usuarios !== id
        )
      );

      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      toast.error(error.message || "Error eliminando usuario");
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id_usuarios);

    setEditData({
      username: user.nombre_usuario || "",
      email: user.correo || "",
      role: user.tipo_usuario || "user",
      password: "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      if (!editData.username.trim()) {
        toast.error("El usuario es obligatorio");
        return;
      }
      if (!editData.email.trim()) {
        toast.error("El correo es obligatorio");
        return;
      }
      await updateUser(id,{
        username: editData.username,
        email: editData.email,
        role: editData.role,
        password: editData.password,
      });
      setUsers((prev) =>
        prev.map((user) => {
          if (user.id_usuarios === id) {
            return {
              ...user,
              nombre_usuario: editData.username,
              correo: editData.email,
              tipo_usuario: editData.role,
            };
          }
          return user;
        })
      );
      setEditingId(null);
      toast.success("Usuario actualizado correctamente");
    } catch (error) {
      toast.error(error.message || "Error actualizando usuario");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      if (
        !newUser.username.trim() ||
        !newUser.email.trim() ||
        !newUser.password.trim()
      ) {
        toast.error("Todos los campos son obligatorios");
        return;
      }

      if (newUser.password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      const response = await createUser({
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password,
      });

      await loadUsers();

      setNewUser({
        username: "",
        email: "",
        role: "user",
        password: "",
      });

      setIsModalOpen(false);

      toast.success(
        response?.message || "Usuario creado correctamente"
      );
    } catch (error) {
      toast.error(error.message || "Error creando usuario");
    }
  };

return (
  <>
    <div className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-5 shadow-lg">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">
          👤 Usuarios
        </h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          + Agregar
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm text-gray-300">

          {/* HEAD */}
          <thead className="bg-[#181818] text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-gray-400"
                >
                  Cargando usuarios...
                </td>
              </tr>

            ) : users.length === 0 ? (

              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-gray-400"
                >
                  No hay usuarios
                </td>
              </tr>

            ) : (

              users.map((user) => (

                <tr
                  key={user.id_usuarios}
                  className="border-b border-gray-800 hover:bg-[#252525] transition"
                >

                  {editingId === user.id_usuarios ? (

                    <>
                      {/* ID */}
                      <td className="px-4 py-3 text-gray-400">
                        {user.id_usuarios}
                      </td>

                      {/* USERNAME */}
                      <td className="px-4 py-3">
                        <input
                          value={editData.username}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              username: e.target.value,
                            })
                          }
                          placeholder="Usuario"
                          className="bg-[#2a2a2a] px-3 py-2 rounded w-full"
                        />
                      </td>

                      {/* EMAIL */}
                      <td className="px-4 py-3">
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              email: e.target.value,
                            })
                          }
                          placeholder="Correo"
                          className="bg-[#2a2a2a] px-3 py-2 rounded w-full"
                        />
                      </td>

                      {/* ROLE */}
                      <td className="px-4 py-3">
                        <select
                          value={editData.role}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              role: e.target.value,
                            })
                          }
                          className="bg-[#2a2a2a] px-3 py-2 rounded"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() =>
                            handleUpdate(user.id_usuarios)
                          }
                          className="text-green-400 hover:underline"
                        >
                          Guardar
                        </button>

                        <button
                          onClick={() =>
                            setEditingId(null)
                          }
                          className="text-gray-400 hover:underline"
                        >
                          Cancelar
                        </button>
                      </td>
                    </>

                  ) : (

                    <>
                      {/* ID */}
                      <td className="px-4 py-3 text-gray-400">
                        {user.id_usuarios}
                      </td>

                      {/* USERNAME */}
                      <td className="px-4 py-3 font-medium text-white">
                        {user.nombre_usuario}
                      </td>

                      {/* EMAIL */}
                      <td className="px-4 py-3 text-gray-400">
                        {user.correo || "-"}
                      </td>

                      {/* ROLE */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.tipo_usuario === "admin"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {user.tipo_usuario}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() =>
                            startEdit(user)
                          }
                          className="text-blue-400 hover:underline"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(user.id_usuarios)
                          }
                          className="text-red-400 hover:underline"
                        >
                          Eliminar
                        </button>
                      </td>
                    </>

                  )}

                </tr>

              ))

            )}

          </tbody>

        </table>
      </div>
    </div>

    {/* MODAL */}
    {isModalOpen && (

      <div
        className="fixed inset-0 bg-black/70 flex items-center justify-center"
        onClick={() => setIsModalOpen(false)}
      >

        {/* CONTENT */}
        <div
          className="bg-[#1f1f1f] p-6 rounded-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >

          <h3 className="mb-4 text-lg font-semibold">
            Nuevo Usuario
          </h3>

          {/* FORM */}
          <form
            onSubmit={handleCreateUser}
            className="space-y-5"
          >

            {/* USERNAME */}
            <input
              placeholder="Usuario"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  username: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-[#2a2a2a] rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Correo"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  email: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-[#2a2a2a] rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* ROLE */}
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  role: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-[#2a2a2a] rounded focus:outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Contraseña"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  password: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-[#2a2a2a] rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* BUTTONS */}
            <div className="flex justify-end gap-2">

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 px-3 py-2 rounded"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="bg-green-500 px-3 py-2 rounded"
              >
                Guardar
              </button>

            </div>

          </form>

        </div>

      </div>

    )}

  </>
);}
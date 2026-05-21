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
  const [loading, setLoading] =
    useState(false);
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "user",
    password: "",
  });

  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({
      username: "",
      password: "",
    });

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers();

      setUsers(response.data || []);
    } catch (error) {
      toast.error(
        error.message ||
          "Error cargando usuarios"
      );
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
    const confirmDelete = confirm(
      "¿Eliminar usuario?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      setUsers((prev) =>
        prev.filter(
          (user) =>
            user.id_usuarios !== id
        )
      );

      toast.success(
        "Usuario eliminado correctamente"
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Error eliminando usuario"
      );
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id_usuarios);

    setEditData({
      username:
        user.nombre_usuario || "",
      email: user.correo || "",
      role:
        user.tipo_usuario || "user",
      password: "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      if (!editData.username.trim()) {
        toast.error(
          "El usuario es obligatorio"
        );
        return;
      }

      if (!editData.email.trim()) {
        toast.error(
          "El correo es obligatorio"
        );
        return;
      }

      await updateUser(id, {
        username: editData.username,
        email: editData.email,
        role: editData.role,
        password: editData.password,
      });

      setUsers((prev) =>
        prev.map((user) => {
          if (
            user.id_usuarios === id
          ) {
            return {
              ...user,
              nombre_usuario:
                editData.username,
              correo: editData.email,
              tipo_usuario:
                editData.role,
            };
          }

          return user;
        })
      );

      setEditingId(null);

      toast.success(
        "Usuario actualizado correctamente"
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Error actualizando usuario"
      );
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
        toast.error(
          "Todos los campos son obligatorios"
        );
        return;
      }

      if (
        newUser.password.length < 6
      ) {
        toast.error(
          "La contraseña debe tener al menos 6 caracteres"
        );
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
        response?.message ||
          "Usuario creado correctamente"
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Error creando usuario"
      );
    }
  };

  return (
    <>
      <div className="bg-[#111827]/95 border border-cyan-400/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-2xl font-bold text-white">
              👤 Usuarios
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Gestiona los usuarios y
              accesos de Ciafy
            </p>
          </div>

          <button
            onClick={() =>
              setIsModalOpen(true)
            }
            className="bg-cyan-500/15 border border-cyan-400/20 text-cyan-300 px-5 py-2.5 rounded-xl hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.45)] transition-all duration-300 cursor-pointer font-medium"
          >
            + Agregar
          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-cyan-400/20 bg-[#0f172a]/70 shadow-inner shadow-cyan-500/5">

          <table className="w-full text-sm text-gray-300">

            {/* HEAD */}
            <thead className="bg-[#0b1120] text-gray-400 text-xs uppercase tracking-wider border-b border-cyan-400/10">

              <tr>
                <th className="px-4 py-4">
                  ID
                </th>

                <th className="px-4 py-4">
                  Usuario
                </th>

                <th className="px-4 py-4">
                  Correo
                </th>

                <th className="px-4 py-4">
                  Tipo
                </th>

                <th className="px-4 py-4 text-right">
                  Acciones
                </th>
              </tr>

            </thead>

            {/* BODY */}
            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-gray-400"
                  >
                    Cargando usuarios...
                  </td>
                </tr>

              ) : users.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-gray-400"
                  >
                    No hay usuarios
                  </td>
                </tr>

              ) : (

                users.map((user) => (

                  <tr
                    key={user.id_usuarios}
                    className="border-b border-cyan-400/5 hover:bg-cyan-500/5 transition-all duration-300"
                  >

                    {editingId ===
                    user.id_usuarios ? (

                      <>

                        {/* ID */}
                        <td className="px-4 py-4">

                          <span className="px-3 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/10 font-semibold">
                            #
                            {
                              user.id_usuarios
                            }
                          </span>

                        </td>

                        {/* USERNAME */}
                        <td className="px-4 py-4">

                          <input
                            value={
                              editData.username
                            }
                            onChange={(
                              e
                            ) =>
                              setEditData(
                                {
                                  ...editData,
                                  username:
                                    e
                                      .target
                                      .value,
                                }
                              )
                            }
                            placeholder="Usuario"
                            className="w-full bg-[#1e293b] border border-cyan-400/15 px-3 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          />

                        </td>

                        {/* EMAIL */}
                        <td className="px-4 py-4">

                          <input
                            type="email"
                            value={
                              editData.email
                            }
                            onChange={(
                              e
                            ) =>
                              setEditData(
                                {
                                  ...editData,
                                  email:
                                    e
                                      .target
                                      .value,
                                }
                              )
                            }
                            placeholder="Correo"
                            className="w-full bg-[#1e293b] border border-cyan-400/15 px-3 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          />

                        </td>

                        {/* ROLE */}
                        <td className="px-4 py-4">

                          <select
                            value={
                              editData.role
                            }
                            onChange={(
                              e
                            ) =>
                              setEditData(
                                {
                                  ...editData,
                                  role:
                                    e
                                      .target
                                      .value,
                                }
                              )
                            }
                            className="bg-[#1e293b] border border-cyan-400/15 px-3 py-2.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          >
                            <option value="user">
                              User
                            </option>

                            <option value="admin">
                              Admin
                            </option>

                          </select>

                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-4 text-right space-x-2">

                          <button
                            onClick={() =>
                              handleUpdate(
                                user.id_usuarios
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-cyan-400 text-black text-xs font-semibold hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all cursor-pointer"
                          >
                            Guardar
                          </button>

                          <button
                            onClick={() =>
                              setEditingId(
                                null
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-gray-700 text-white text-xs hover:bg-gray-600 transition-all cursor-pointer"
                          >
                            Cancelar
                          </button>

                        </td>

                      </>

                    ) : (

                      <>

                        {/* ID */}
                        <td className="px-4 py-4">

                          <span className="px-3 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/10 font-semibold">
                            #
                            {
                              user.id_usuarios
                            }
                          </span>

                        </td>

                        {/* USERNAME */}
                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-cyan-400/15 border border-cyan-400/20 flex items-center justify-center text-cyan-300 font-bold uppercase">
                              {user.nombre_usuario?.charAt(
                                0
                              )}
                            </div>

                            <div>

                              <p className="text-white font-medium">
                                {
                                  user.nombre_usuario
                                }
                              </p>

                              <p className="text-xs text-gray-500">
                                Usuario del
                                sistema
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* EMAIL */}
                        <td className="px-4 py-4 text-gray-400">
                          {user.correo ||
                            "-"}
                        </td>

                        {/* ROLE */}
                        <td className="px-4 py-4">

                          <span
                            className={`px-3 py-1 rounded-full text-xs border ${
                              user.tipo_usuario ===
                              "admin"
                                ? "bg-purple-500/10 border-purple-400/20 text-purple-300"
                                : "bg-cyan-500/10 border-cyan-400/20 text-cyan-300"
                            }`}
                          >
                            {
                              user.tipo_usuario
                            }
                          </span>

                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-4 text-right space-x-2">

                          <button
                            onClick={() =>
                              startEdit(
                                user
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/15 text-cyan-300 text-xs hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.45)] transition-all cursor-pointer"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                user.id_usuarios
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-400/15 text-red-400 text-xs hover:bg-red-500 hover:text-white transition-all cursor-pointer"
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() =>
            setIsModalOpen(false)
          }
        >

          <div
            className="bg-[#111827] border border-cyan-400/20 p-6 rounded-3xl w-full max-w-md shadow-[0_0_40px_rgba(34,211,238,0.12)]"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}
            <div className="mb-6">

              <h3 className="text-2xl font-bold text-white">
                Nuevo Usuario
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                Agrega un nuevo usuario
                al sistema
              </p>

            </div>

            {/* FORM */}
            <form
              onSubmit={
                handleCreateUser
              }
              className="space-y-5"
            >

              {/* USERNAME */}
              <input
                placeholder="Usuario"
                value={
                  newUser.username
                }
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    username:
                      e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-[#1e293b] border border-cyan-400/15 text-white rounded-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />

              {/* EMAIL */}
              <input
                type="email"
                placeholder="Correo"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    email:
                      e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-[#1e293b] border border-cyan-400/15 text-white rounded-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />

              {/* ROLE */}
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role:
                      e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-[#1e293b] border border-cyan-400/15 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="user">
                  User
                </option>

                <option value="admin">
                  Admin
                </option>

              </select>

              {/* PASSWORD */}
              <input
                type="password"
                placeholder="Contraseña"
                value={
                  newUser.password
                }
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    password:
                      e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-[#1e293b] border border-cyan-400/15 text-white rounded-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="px-5 py-2.5 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-all cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-semibold hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all cursor-pointer"
                >
                  Guardar
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </>
  );
}
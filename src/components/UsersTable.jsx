import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/usersServices";

export default function UsersTable() {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({
        name: "",
        email: "",
        role: "",
    });

    const loadUsers = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    //   useEffect(() => {
    //     loadUsers();
    //   }, []);

    useEffect(() => {
            const fetchUsers = async () => {
                const data = await getUsers();
                setUsers(data);
            };

            fetchUsers();
        }, []);

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar usuario?")) return;
        await deleteUser(id);
        loadUsers();
    };

    const startEdit = (user) => {
        setEditingId(user.id);
        setEditData(user);
    };

    const handleUpdate = async (id) => {
        await updateUser(id, editData);
        setEditingId(null);
        loadUsers();
    };

  return (
    <>
      <div className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-5 shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">👤 Usuarios</h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            + Agregar
          </button>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm text-gray-300">
            
            <thead className="bg-[#181818] text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-800 hover:bg-[#252525] transition"
                >
                  {editingId === user.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="bg-[#2a2a2a] px-2 py-1 rounded"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <input
                          value={editData.email}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                          className="bg-[#2a2a2a] px-2 py-1 rounded"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={editData.role}
                          onChange={(e) =>
                            setEditData({ ...editData, role: e.target.value })
                          }
                          className="bg-[#2a2a2a] px-2 py-1 rounded"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleUpdate(user.id)}
                          className="text-green-400"
                        >
                          Guardar
                        </button>

                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-400"
                        >
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium text-white">
                        {user.name}
                      </td>

                      <td className="px-4 py-3 text-gray-400">
                        {user.email}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => startEdit(user)}
                          className="text-blue-400 hover:underline"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-400 hover:underline"
                        >
                          Eliminar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
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
          <div
            className="bg-[#1f1f1f] p-6 rounded-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold">
              Nuevo Usuario
            </h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (!newUser.name || !newUser.email || !newUser.password) {
                    alert("Todos los campos son obligatorios");
                    return;
                }

                if (newUser.password.length < 4) {
                    alert("La contraseña debe tener al menos 4 caracteres");
                    return;
                }

                await createUser(newUser);

                setNewUser({ name: "", email: "", password: "", role: "user" });
                setIsModalOpen(false);
                loadUsers();
              }}
              className="space-y-5"
            >
              <input
                placeholder="Nombre"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#2a2a2a] rounded"
              />

              <input
                placeholder="Correo"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#2a2a2a] rounded"
              />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={newUser.password}
                    onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#2a2a2a] rounded 
                    focus:outline-none focus:ring-2 focus:ring-green-500"
                />

              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#2a2a2a] rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

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
  );
}
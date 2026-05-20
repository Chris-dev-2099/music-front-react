import api from "./api";

// const isMock = true;

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.message ||
        "Error al obtener usuarios",
      status:
        error.response?.status || 500,
    };
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.message ||
        "Error al obtener usuario",

      status:
        error.response?.status || 500,
    };
  }
};

export const createUser = async ({ username, email, role, password,}) => {
  try {
    const response = await api.post("/users/register", {
      nombre_usuario: username,
      correo: email,
      tipo_usuario: role,
      contrasena: password,
    });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Error al registrar usuario",
      status: error.response?.status || 500,
    };
  }
};

export const updateUser = async (id,{ username,email,role,password }) => {
  try {
    const body = {
      nombre_usuario: username,
      correo: email,
      tipo_usuario: role,
    };
    if (password?.trim()) {
      body.contrasena = password;
    }
    const response = await api.put(`/users/${id}`,body);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || "Error al actualizar usuario",
      status: error.response?.status || 500,
    };
  }
};

export const deleteUser = async (id) => {

  try {

    const response = await api.delete(
      `/users/${id}`
    );

    return response.data;

  } catch (error) {

    throw {
      message:
        error.response?.data?.message ||
        "Error al eliminar usuario",

      status:
        error.response?.status || 500,
    };

  }

};
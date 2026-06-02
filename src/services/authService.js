import api from "./api";

let isMock = false;

const mockUser = {
  id: 1,
  nombre_usuario: "admin",
  contrasena: "123456",
  token: "mock-jwt-token",
};

const fakeDelay = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export const login = async ({ username, password }) => {

  try {

    if (isMock) {

    await fakeDelay(800);

    if (
      username === mockUser.nombre_usuario &&
      password === mockUser.contrasena
    ) {

      const response = {
        token: mockUser.token,

        user: {
          id: mockUser.id,
          nombre_usuario:
            mockUser.nombre_usuario,
        },
      };

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      return response;

    }

    throw {
      message: "Credenciales incorrectas",
      status: 401,
    };

  }

    const response = await api.post("/users/login", {
      nombre_usuario: username,
      contrasena: password,
    });

    console.log("Login response:", response);

    const data = response.data.data;

    localStorage.setItem("token", data.token);

    if (data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }

    return data;

  } catch (error) {

    throw {
      message:
        error.response?.data?.message ||
        "Error al iniciar sesión",

      status:
        error.response?.status || 500,
    };

  }
};

export const register = async ({
  username,
  email,
  role,
  password,
}) => {

  try {
    if (isMock) {

      await fakeDelay(800);

      return {
        success: true,

        data: {
          id_usuario: Date.now(),

          nombre_usuario:
            username,

          correo: email,

          tipo_usuario:
            role,

        },
      };

    }

    const response =
      await api.post(
        "/users/register",
        {
          nombre_usuario:
            username,

          correo: email,

          tipo_usuario:
            role,

          contrasena:
            password,
        }
      );

    return response.data;

  } catch (error) {

    throw {

      message:
        error.response?.data
          ?.message ||
        "Error al registrar usuario",

      status:
        error.response?.status ||
        500,

    };

  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user
    ? JSON.parse(user)
    : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
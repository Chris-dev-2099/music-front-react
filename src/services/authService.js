// services/authService.js

const mockUser = {
  email: "admin@mail.com",
  password: "123456",
  name: "Admin",
};

const fakeDelay = (ms) => new Promise((res) => setTimeout(res, ms));

export const login = async ({ email, password }) => {
  await fakeDelay(800);

  if (email === mockUser.email && password === mockUser.password) {
    const response = {
      token: "fake-jwt-token",
      user: {
        name: mockUser.name,
        email: mockUser.email,
      },
    };

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response;
  }

  throw {
    message: "Credenciales incorrectas",
    status: 401,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
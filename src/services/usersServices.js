// services/usersService.js

let usersDB = [
  {
    id: 1,
    name: "Admin",
    email: "admin@mail.com",
    role: "admin",
  },
  {
    id: 2,
    name: "User Demo",
    email: "user@mail.com",
    role: "user",
  },
];

const fakeDelay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getUsers = async () => {
  await fakeDelay(500);
  return [...usersDB];
};


export const getUserById = async (id) => {
  await fakeDelay(300);
  return usersDB.find((user) => user.id === id);
};

export const createUser = async (data) => {
  await fakeDelay(500);

  // Validación básica
  if (!data.name || !data.email) {
    throw {
      message: "Nombre y correo son obligatorios",
      status: 400,
    };
  }

  // Validar email duplicado
  const exists = usersDB.find((u) => u.email === data.email);
  if (exists) {
    throw {
      message: "El correo ya existe",
      status: 400,
    };
  }

  const newUser = {
    id: Date.now(),
    name: data.name,
    email: data.email,
    password: data.password, 
    role: data.role || "user",
  };

  usersDB.push(newUser);

  return newUser;
};

export const updateUser = async (id, data) => {
  await fakeDelay(500);

  usersDB = usersDB.map((user) =>
    user.id === id ? { ...user, ...data } : user
  );

  return usersDB.find((user) => user.id === id);
};


export const deleteUser = async (id) => {
  await fakeDelay(500);

  usersDB = usersDB.filter((user) => user.id !== id);

  return { success: true };
};
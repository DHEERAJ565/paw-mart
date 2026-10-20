// const API_URL = "http://localhost:5000/api/auth";

// async function request(endpoint, data) {
//   const response = await fetch(`${API_URL}/${endpoint}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//     body: JSON.stringify(data),
//   });

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || "Something went wrong.");
//   }

//   return result;
// }

// export function registerUser({ name, email, password }) {
//   return request("register", { name, email, password });
// }

// export function loginUser({ email, password }) {
//   return request("login", { email, password });
// }

// export function logoutUser() {
//   return fetch(`${API_URL}/logout`, {
//     method: "POST",
//     credentials: "include",
//   });
// }


const API_URL = "http://localhost:5000/api/auth";

async function request(endpoint, data) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
}

export function registerUser({ name, email, password }) {
  return request("register", { name, email, password });
}

export function loginUser({ email, password }) {
  return request("login", { email, password });
}

export async function logoutUser() {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Logout failed.");
  }

  return result;
}
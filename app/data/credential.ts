type User = {
  email: string;
  password: string;
  name: string;
  role: string;
  other: string;
};

const users: User[] = [
  {
    email: "user@company.com",
    password: "pass",
    name: "A",
    role: "user",
    other: "...",
  },
  {
    email: "admin@company.com",
    password: "pass",
    name: "B",
    role: "admin",
    other: "...",
  },
  {
    email: "manager@company.com",
    password: "pass",
    name: "C",
    role: "manager",
    other: "...",
  },
];

export type Credential = {
  email: string;
  name: string;
  token: string;
  role: string;
};

export const login = (
  email: string,
  pass: string,
): Promise<Credential | string> => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (Math.random() <= 0.8) {
          // find user by email and password
          const user = users.find(
            (u) => u.email === email && u.password === pass,
          );
          //user not found
          if (user === undefined) {
            reject("user not found");
            return;
          }
          //user found
          const newCredential: Credential = {
            email: user.email,
            name: user.name,
            token: crypto.randomUUID(),
            role: user.role,
          };
          // ... store credential
          resolve(newCredential);
        } else {
          reject("connection refused");
        }
      },
      1000 + Math.random() * 2000,
    );
  });
};

export const logout = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (Math.random() <= 0.8) {
          //... remove credential
          resolve("success");
        } else {
          reject("connection refused");
        }
      },
      1000 + Math.random() * 2000,
    );
  });
};
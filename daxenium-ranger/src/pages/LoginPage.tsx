import { useState } from "react";
import { db } from "../database/db";
import { useEffect } from "react";

interface Props {
  onLogin: () => void;
}

export default function LoginPage({
  onLogin,
}: Props) {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

    useEffect(() => {

  createDefaultUser();

}, []);

const createDefaultUser =
  async () => {

    const existingUser =
      await db.users
        .where("username")
        .equals("admin")
        .first();

    if (existingUser) {
      return;
    }

    await db.users.add({

      id: crypto.randomUUID(),

      username: "admin",

      passwordHash:
        "admin123",

      isActive: true,

      lastSync:
        new Date()
          .toISOString(),

    });

  };
  
  const login = async () => {

    const user =
      await db.users
        .where("username")
        .equals(username)
        .first();

    if (!user) {

      alert(
        "Hibás felhasználónév!"
      );

      return;
    }

    if (
      user.passwordHash !==
      password
    ) {

      alert(
        "Hibás jelszó!"
      );

      return;
    }

    localStorage.setItem(
      "currentUser",
      username
    );

    onLogin();
  };

  return (

    <div className="page-container">

      <div className="card">

        <h1>
          🌲 DAXENIUM
          TIMBERTRACK
        </h1>

        <input
          type="text"
          placeholder="Felhasználónév"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={{
            marginTop: "10px",
          }}
        />

        <button
          className="dashboard-green"
          style={{
            marginTop: "20px",
          }}
          onClick={login}
        >
          🔐 Belépés
        </button>

      </div>

    </div>

  );
}
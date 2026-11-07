"use client";

import { useSyncExternalStore } from "react";
import type { Credential } from "../app/data/credential";
import { CREDENTIAL_CHANGE_EVENT } from "../utils/login";

const subscribeToCredential = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(CREDENTIAL_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CREDENTIAL_CHANGE_EVENT, callback);
  };
};

const getCredentialSnapshot = () => window.localStorage.getItem("credential");
const getServerCredentialSnapshot = () => null;

const isCredential = (value: unknown): value is Credential => {
  if (typeof value !== "object" || value === null) return false;
  const credential = value as Record<string, unknown>;
  return (
    typeof credential.role === "string" &&
    typeof credential.name === "string" &&
    typeof credential.email === "string"
  );
};

export default function UserInfo() {
  const credentialSnapshot = useSyncExternalStore(
    subscribeToCredential,
    getCredentialSnapshot,
    getServerCredentialSnapshot,
  );

  let credential: Credential | null = null;
  if (credentialSnapshot !== null) {
    try {
      const parsed: unknown = JSON.parse(credentialSnapshot);
      if (isCredential(parsed)) credential = parsed;
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
    }
  }

  if (credential === null) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] font-bold text-zinc-900">
      <div>
        ROLE:{" "}
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-600">
          {credential.role.toUpperCase()}
        </span>
      </div>
      <div>
        NAME:{" "}
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">
          {credential.name}
        </span>
      </div>
      <div>
        EMAIL:{" "}
        <span className="rounded-full bg-gray-100 px-2 py-0.5 font-normal text-gray-600">
          {credential.email}
        </span>
      </div>
    </div>
  );
}

import { Credential, logout } from "../app/data/credential";
import { useRouter } from "next/navigation";
type Router = ReturnType<typeof useRouter>;

export const CREDENTIAL_CHANGE_EVENT = "credential-change";

export const notifyCredentialChange = () => {
  window.dispatchEvent(new Event(CREDENTIAL_CHANGE_EVENT));
};

export const checkLogin = (router: Router, retrunPath: string) => {
  // back up return path
  localStorage.setItem("returnPath", retrunPath);
  //check credential
  const credentialString = localStorage.getItem("credential");
  if (credentialString !== null) {
    //ok
    const { token, email, name, role }: Credential =
      JSON.parse(credentialString);
    if (
      token === undefined ||
      email === undefined ||
      name === undefined ||
      role === undefined
    ) {
      // fail
      router.replace("/login");
      router.refresh();
    } else {
      //success
      router.replace(retrunPath);
      router.refresh();
    }
  } else {
    // fail
    router.replace("/login");
    router.refresh();
  }
};

export const doLogout = (router: Router, returnPath: string) => {
  const credentialString = localStorage.getItem("credential");
  if (credentialString !== null) {
    const { token }: Credential = JSON.parse(credentialString);
    logout(token)
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        localStorage.removeItem("credential");
        notifyCredentialChange();
        router.replace(returnPath);
        router.refresh();
      });
  } else {
    router.replace(returnPath);
    router.refresh();
  }
};
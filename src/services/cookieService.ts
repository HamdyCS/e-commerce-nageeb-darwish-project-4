import Cookies from "universal-cookie";

const cookie = new Cookies();

export function setInCookie(name: string, value: string) {
  //set new token to token cookie
  cookie.set(name, value, {
    path: "/",
    sameSite: "lax",
  });
}

export function getFromCookie(name: string): string | null {
  //get from cookie
  return cookie.get<string | null>(name);
}

export function removeFromCookie(name: string) {
  //remove from cookie
  cookie.remove(name, { path: "/", sameSite: "lax" });
}

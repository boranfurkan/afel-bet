import Cookies from "js-cookie";

export function getJWTFromCookie(): string | null {
  return Cookies.get("jwt") || null;
}

export function setJWTCookie(token: string): void {
  Cookies.set("jwt", token, {
    expires: 0.5, // 12 hours (0.5 days)
    path: "/",
    sameSite: "lax",
  });
}

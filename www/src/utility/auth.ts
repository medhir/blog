import Cookies from "cookies";
import http from "./http";

const JWTCookieName = "tr4x2ki0ptz";
const RefreshCookieName = "y4h3j18f92knu2";

export interface AuthenticatedResponse {
  auth: boolean;
  cookies?: string;
}

export const Authenticated = async (
  ctx: any,
  role: string
): Promise<AuthenticatedResponse> => {
  try {
    const authResponse = await http.Get(`/jwt/validate/${role}`, {
      headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined,
    });
    return {
      auth: true,
      cookies: ctx.req.headers.cookie,
    };
  } catch (err) {
    try {
      const cookies = new Cookies(ctx.req, ctx.res);
      const refreshResponse = await http.Get("/jwt/next/refresh", {
        headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined,
        withCredentials: true,
      });
      cookies.set(JWTCookieName, refreshResponse.data.token);
      return {
        auth: true,
        cookies: `${JWTCookieName}=${
          refreshResponse.data.token
        }; ${RefreshCookieName}=${cookies.get(RefreshCookieName)}`,
      };
    } catch (err) {
      return { auth: false };
    }
  }
};

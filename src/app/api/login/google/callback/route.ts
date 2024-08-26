import { lucia } from "@/auth";
import prisma from "@/db";
import { google } from "@/lib/google.init";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = cookies().get("state")?.value ?? null;
    const storedCodeVerifier = cookies().get("codeVerifier")?.value ?? null;
    if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
      return new Response(null, {
        status: 400,
        headers: {
          Location: "/login",
        },
      });
    }
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );
    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const googleUser: GoogleUser = await response.json();

    const isEmailRegistered = await prisma.user.findFirst({
      where: {
        AND: [
          {
            email: googleUser.email,
          },
          {
            googleId: {
              equals: null,
            },
          },
        ],
      },
    });

    if (isEmailRegistered) {
      return NextResponse.redirect(
        new URL(
          "/login?message=Another user have been registered with the same email",
          request.url
        )
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        googleId: googleUser.sub,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const newUser = await prisma.user.create({
      data: {
        googleId: googleUser.sub,
        email: googleUser.email,
        passwordHash: "",
        username: `${googleUser.family_name}_${googleUser.given_name}`,
        emailVerified: googleUser.email_verified,
      },
    });

    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
        headers: {
          Location: "/login",
        },
      });
    }
    return new Response(null, {
      status: 500,
      headers: {
        Location: "/login",
      },
    });
  }
};

interface GoogleUser {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
}

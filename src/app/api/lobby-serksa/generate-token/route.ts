import jwt from "jsonwebtoken";

export async function POST() {
  const token = jwt.sign(
    { message: process.env.LOBBY_SERKSA_MESSAGE || "" },
    process.env.LOBBY_SERKSA_SECRET || "secret",
    { expiresIn: "1h" },
  );
  return new Response(JSON.stringify({ token }), { status: 200 });
}

import jwt from "jsonwebtoken";

export async function POST() {
  const token = jwt.sign(
    { message: process.env.QUIZ_LOBBY_MESSAGE || "" },
    process.env.QUIZ_LOBBY_SECRET || "secret",
    { expiresIn: "1h" },
  );
  return new Response(JSON.stringify({ token }), { status: 200 });
}

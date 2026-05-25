import { NextResponse } from "next/server";
import { buscarTodas } from "@/lib/db/mensagens";

export async function GET() {
  const mensagens = await buscarTodas(100);
  return NextResponse.json({ mensagens });
}

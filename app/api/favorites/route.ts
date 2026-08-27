import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: obtener todos los favoritos del usuario logueado
export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { savedAt: "desc" },
  });

  return NextResponse.json(favorites);
}

// POST: guardar un nuevo favorito
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const body = await request.json();
  const { articleUrl, title, source, imageUrl, publishedAt } = body;

  try {
    const favorite = await prisma.favorite.create({
      data: {
        articleUrl,
        title,
        source,
        imageUrl,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        userId: user.id,
      },
    });
    return NextResponse.json(favorite);
  } catch (error) {
    // si ya existe (por el @@unique que pusimos), no truena, solo avisa
    return NextResponse.json(
      { error: "Ya guardaste este artículo" },
      { status: 409 }
    );
  }
}

// DELETE: quitar un favorito
export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const articleUrl = searchParams.get("articleUrl");

  if (!articleUrl) {
    return NextResponse.json({ error: "Falta articleUrl" }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: { userId: user.id, articleUrl },
  });

  return NextResponse.json({ success: true });
}
import { NextResponse } from 'next/server';
import { getProductos } from '@/lib/productos';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const productos = await getProductos({
      slug: searchParams.get('slug') ?? undefined,
      categoria: searchParams.get('categoria') ?? undefined,
      marca: searchParams.get('marca') ?? undefined,
      talla: searchParams.get('talla') ?? undefined,
      disponible: searchParams.get('disponible') === 'true',
      ordenar: searchParams.get('ordenar') ?? undefined,
      busqueda: searchParams.get('busqueda') ?? undefined,
    });

    return NextResponse.json(productos);
  } catch (err) {
    console.error('Error in products API:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

import { serverSupabaseClient } from '#supabase/server';


export default defineEventHandler(async (event) => {
  const db = await serverSupabaseClient(event);

  const { data, error } = await db
    .from('offices')
    .select(`
      id,
      slug,
      name,
      description,
      address,
      location_lat,
      location_lng,
      phone,
      opening_hours
    `)
    .eq('active', true)
    .order('name', { ascending: true });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return {
    items: data.map(office => ({
      slug: office.slug,
      name: office.name,
      description: office.description,
      address: office.address,
      locationLat: office.location_lat,
      locationLng: office.location_lng,
      phone: office.phone,
      openingHours: office.opening_hours,
    })) || [],
  };
});

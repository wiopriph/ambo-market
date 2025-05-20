type Post = {
  productId: string;
  cityId: string;
  categoryId: string;
  subcategoryId?: string;
  brandId?: string;
};

export function getPostRoute(post: Post) {
  const {
    productId,
    cityId,
    categoryId,
    subcategoryId,
    brandId,
  } = post;

  if (categoryId && subcategoryId && brandId) {
    return {
      name: 'cityId-categoryId-subcategoryId-brandId-productId',
      params: {
        cityId,
        categoryId,
        subcategoryId,
        brandId,
        productId,
      },
    };
  }

  if (categoryId && subcategoryId) {
    return {
      name: 'cityId-categoryId-subcategoryId-productId',
      params: { cityId, categoryId, subcategoryId, productId },
    };
  }

  return {
    name: 'cityId-categoryId-productId',
    params: { cityId, categoryId, productId },
  };
}

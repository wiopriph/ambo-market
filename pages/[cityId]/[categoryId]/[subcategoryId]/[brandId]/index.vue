<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import { getCityById } from '~/constants/cities';
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';


definePageMeta({
  middleware: [
    'validate-city',
    'validate-brand',
    'set-city-middleware',
    'set-filters-middleware',
  ],
});

const {
  cityId,
  coords,
  locationName,
  isPriorityCity,
  page,
  isLoading,
  fetchPosts,
  getFilter,
} = usePosts();

const { t } = useI18n();
const route = useRoute();

const breadcrumbs = computed(() => {
  const breadcrumbs = [];

  if (isPriorityCity.value) {
    const city = getCityById(cityId.value);

    breadcrumbs.push({
      title: city?.name || t('main_page'),
      to: {
        name: 'cityId',
        params: {
          cityId: cityId.value,
        },
      },
    });
  } else {
    breadcrumbs.push({
      title: t('main_page'),
      to: { name: 'index' },
    });
  }

  const categoryId = route.params.categoryId;

  breadcrumbs.push({
    title: t(`categories.${categoryId}`),
    to: {
      name: 'cityId-categoryId',
      params: {
        categoryId,
        cityId: cityId.value,
      },
    },
  });

  const subcategoryId = route.params.subcategoryId;

  breadcrumbs.push({
    title: t(`subcategories.${subcategoryId}`),
    to: {
      name: 'cityId-categoryId-subcategoryId',
      params: {
        cityId: cityId.value,
        categoryId,
        subcategoryId,
      },
    },
  });

  const brandId = route.params.brandId;
  const searchQuery = getFilter('q');

  if (searchQuery) {
    breadcrumbs.push({
      title: t(`brands.${brandId}`),
      to: {
        name: 'cityId-categoryId-subcategoryId-brandId',
        params: {
          cityId: cityId.value,
          categoryId,
          subcategoryId,
          brandId,
        },
      },
    });

    breadcrumbs.push({ title: searchQuery });
  } else {
    breadcrumbs.push({ title: t(`brands.${brandId}`) });
  }

  return breadcrumbs;
});

const seo = computed(() => {
  const searchQuery = getFilter('q');

  let translationKey;

  if (searchQuery) {
    translationKey = isPriorityCity.value ? 'search.city' : 'search.everywhere';
  } else {
    const subcategoryId = route.params.subcategoryId;
    const brandId = route.params.brandId;

    const cityKey = isPriorityCity.value ? 'city' : 'everywhere';

    translationKey = `${subcategoryId}.${brandId}.${cityKey}`;
  }

  return {
    h1: t(`${translationKey}.h1`, { city: locationName.value, q: searchQuery }),
    title: t(`${translationKey}.title`, { city: locationName.value, q: searchQuery }),
    description: t(`${translationKey}.description`, { city: locationName.value, q: searchQuery }),
  };
});

const title = computed(() => seo.value.title);

const meta = computed(() => [
  { key: 'og:title', property: 'og:title', content: seo.value.title },
  { key: 'twitter:title', property: 'twitter:title', content: seo.value.title },
  { key: 'description', name: 'description', content: seo.value.description },
  { key: 'og:description', property: 'og:description', content: seo.value.description },
  { key: 'twitter:description', property: 'twitter:description', content: seo.value.description },
]);

useHead({ title: title.value, meta: meta.value });


const { data: posts } = await useAsyncData('posts', () => fetchPosts(), {
  watch: [() => [coords, route.query, route.params]],
});


const totalPages = computed(() => {
  const postsCount = posts.value?.resultsCount || 0;

  return Math.ceil(postsCount / MAX_POSTS_PER_PAGE);
});

const hasPagination = computed(() => totalPages.value > 1);

const setPage = (pageNumber: number) => {
  navigateTo({ query: { ...route.query, page: pageNumber } });
};
</script>

<i18n lang="json">
{
  "en": {
    "main_page": "Main page",
    "search": {
      "city": {
        "h1": "Listings for «{q}» in {city}",
        "title": "{q} for Sale in {city} at the Best Prices {'|'} Ambo Market",
        "description": "Find and buy {q} in {city} – fresh listings 🤩 with photos, prices, and seller reviews 💬. Sell your items fast on Ambo Market – Angola’s trusted marketplace."
      },
      "everywhere": {
        "h1": "Listings for «{q}»",
        "title": "{q} for Sale at the Best Prices {'|'} Ambo Market",
        "description": "Explore listings for {q} across Angola. Buy or sell with confidence 💸 – with reviews, photos and trusted sellers on Ambo Market."
      }
    },

    "motorcycles": {
      "other": {
        "city": {
          "h1": "Motorcycles for Sale in {city}",
          "title": "Buy and Sell Motorcycles in {city} {'|'} Ambo Market",
          "description": "Browse listings for all motorcycle brands in {city}. Post your ad for free."
        },
        "everywhere": {
          "h1": "Motorcycles for Sale",
          "title": "Buy and Sell Motorcycles in Angola {'|'} Ambo Market",
          "description": "Discover bikes and scooters for sale from all brands across Angola. Trusted ads only."
        }
      },
      "honda": {
        "city": {
          "h1": "Honda Motorcycles in {city}",
          "title": "Buy and Sell Honda Motorcycles in {city} {'|'} Ambo Market",
          "description": "Find Honda bikes like CG, CBR, Africa Twin and more in {city}. Post your ad today."
        },
        "everywhere": {
          "h1": "Honda Motorcycles",
          "title": "Buy and Sell Honda Motorcycles in Angola {'|'} Ambo Market",
          "description": "Browse new and used Honda bikes across Angola. Reliable, powerful and affordable."
        }
      },
      "yamaha": {
        "city": {
          "h1": "Yamaha Motorcycles in {city}",
          "title": "Buy and Sell Yamaha Motorcycles in {city} {'|'} Ambo Market",
          "description": "Explore Yamaha bikes in {city} – YBR, Fazer, MT-07 and more. List or buy now."
        },
        "everywhere": {
          "h1": "Yamaha Motorcycles",
          "title": "Buy and Sell Yamaha Motorcycles in Angola {'|'} Ambo Market",
          "description": "Shop Yamaha bikes across Angola. Great for commuting, sport or adventure."
        }
      },
      "suzuki": {
        "city": {
          "h1": "Suzuki Motorcycles in {city}",
          "title": "Buy and Sell Suzuki Motorcycles in {city} {'|'} Ambo Market",
          "description": "Check out Suzuki bikes like GSX, DR-Z and more in {city}. Post your listing free."
        },
        "everywhere": {
          "h1": "Suzuki Motorcycles",
          "title": "Buy and Sell Suzuki Motorcycles in Angola {'|'} Ambo Market",
          "description": "Browse Suzuki listings in Angola – both new and used. Trusted sellers only."
        }
      },
      "kawasaki": {
        "city": {
          "h1": "Kawasaki Motorcycles in {city}",
          "title": "Buy and Sell Kawasaki Motorcycles in {city} {'|'} Ambo Market",
          "description": "Find Kawasaki bikes like Ninja, Versys, Z-Series and more in {city}."
        },
        "everywhere": {
          "h1": "Kawasaki Motorcycles",
          "title": "Buy and Sell Kawasaki Motorcycles in Angola {'|'} Ambo Market",
          "description": "Powerful and stylish – browse Kawasaki motorcycle listings across Angola."
        }
      },
      "vespa": {
        "city": {
          "h1": "Vespa Scooters in {city}",
          "title": "Buy and Sell Vespa Scooters in {city} {'|'} Ambo Market",
          "description": "Discover the iconic Vespa scooters in {city}. Classic design, perfect for the city."
        },
        "everywhere": {
          "h1": "Vespa Scooters",
          "title": "Buy and Sell Vespa Scooters in Angola {'|'} Ambo Market",
          "description": "Find new and used Vespa scooters for sale across Angola. Post or explore ads now."
        }
      },
      "ducati": {
        "city": {
          "h1": "Ducati Motorcycles in {city}",
          "title": "Buy and Sell Ducati Motorcycles in {city} {'|'} Ambo Market",
          "description": "High-performance bikes like the Monster, Multistrada, Panigale and more in {city}."
        },
        "everywhere": {
          "h1": "Ducati Motorcycles",
          "title": "Buy and Sell Ducati Motorcycles in Angola {'|'} Ambo Market",
          "description": "Shop Ducati bikes across Angola. Speed, style and Italian engineering."
        }
      },
      "bmw-motorrad": {
        "city": {
          "h1": "BMW Motorrad in {city}",
          "title": "Buy and Sell BMW Motorcycles in {city} {'|'} Ambo Market",
          "description": "Find BMW bikes like GS Series, F 850, R 1250 and more in {city}. Premium quality guaranteed."
        },
        "everywhere": {
          "h1": "BMW Motorrad",
          "title": "Buy and Sell BMW Motorcycles in Angola {'|'} Ambo Market",
          "description": "Explore BMW Motorrad listings across Angola. Adventure and touring bikes available."
        }
      },
      "harley-davidson": {
        "city": {
          "h1": "Harley-Davidson in {city}",
          "title": "Buy and Sell Harley-Davidson in {city} {'|'} Ambo Market",
          "description": "Classic American motorcycles like the Sportster, Softail, Road King and more in {city}."
        },
        "everywhere": {
          "h1": "Harley-Davidson",
          "title": "Buy and Sell Harley-Davidson in Angola {'|'} Ambo Market",
          "description": "Ride with freedom – shop Harley-Davidson bikes across Angola. List or buy today."
        }
      },
      "aprilia": {
        "city": {
          "h1": "Aprilia Motorcycles in {city}",
          "title": "Buy and Sell Aprilia Motorcycles in {city} {'|'} Ambo Market",
          "description": "Aprilia RSV4, Tuareg, SR GT and more available in {city}. Sporty, stylish and reliable."
        },
        "everywhere": {
          "h1": "Aprilia Motorcycles",
          "title": "Buy and Sell Aprilia Motorcycles in Angola {'|'} Ambo Market",
          "description": "Italian performance and design – browse Aprilia bikes across Angola."
        }
      }
    },
    "cars": {
      "other": {
        "city": {
          "h1": "Cars for Sale in {city}",
          "title": "Buy and Sell Cars in {city} {'|'} Ambo Market",
          "description": "Explore various car brands in {city}. Browse listings and post your ad for free."
        },
        "everywhere": {
          "h1": "Cars for Sale",
          "title": "Buy and Sell Cars in Angola {'|'} Ambo Market",
          "description": "Browse a variety of car brands across Angola. Sell or find vehicles easily."
        }
      },
      "toyota": {
        "city": {
          "h1": "Toyota Cars for Sale in {city}",
          "title": "Buy and Sell Toyota in {city} {'|'} Ambo Market",
          "description": "Find Toyota models like Hilux, Corolla and Land Cruiser in {city}. Trusted sellers only."
        },
        "everywhere": {
          "h1": "Toyota Cars for Sale",
          "title": "Buy and Sell Toyota in Angola {'|'} Ambo Market",
          "description": "Explore Toyota listings across Angola – from budget to premium models."
        }
      },
      "suzuki": {
        "city": {
          "h1": "Suzuki Cars for Sale in {city}",
          "title": "Buy and Sell Suzuki in {city} {'|'} Ambo Market",
          "description": "Browse Suzuki cars in {city}. Swift, Vitara, Jimny and more. Post your ad for free."
        },
        "everywhere": {
          "h1": "Suzuki Cars for Sale",
          "title": "Buy and Sell Suzuki in Angola {'|'} Ambo Market",
          "description": "Discover Suzuki listings in Angola. Great deals from trusted sellers."
        }
      },
      "hyundai": {
        "city": {
          "h1": "Hyundai Cars for Sale in {city}",
          "title": "Buy and Sell Hyundai in {city} {'|'} Ambo Market",
          "description": "Explore Hyundai models like Tucson, Accent, Elantra and more in {city}."
        },
        "everywhere": {
          "h1": "Hyundai Cars for Sale",
          "title": "Buy and Sell Hyundai in Angola {'|'} Ambo Market",
          "description": "Find new and used Hyundai vehicles for sale across Angola."
        }
      },
      "kia": {
        "city": {
          "h1": "Kia Cars for Sale in {city}",
          "title": "Buy and Sell Kia in {city} {'|'} Ambo Market",
          "description": "Search for Kia cars in {city} – Sportage, Rio, Picanto and more."
        },
        "everywhere": {
          "h1": "Kia Cars for Sale",
          "title": "Buy and Sell Kia in Angola {'|'} Ambo Market",
          "description": "Kia vehicles available in Angola. Browse or post listings now."
        }
      },
      "mitsubishi": {
        "city": {
          "h1": "Mitsubishi Cars in {city}",
          "title": "Buy and Sell Mitsubishi in {city} {'|'} Ambo Market",
          "description": "Find Pajero, L200 and other Mitsubishi models in {city}. Post your ad for free."
        },
        "everywhere": {
          "h1": "Mitsubishi Cars",
          "title": "Buy and Sell Mitsubishi in Angola {'|'} Ambo Market",
          "description": "Explore Mitsubishi cars across Angola. Trusted ads only."
        }
      },
      "chevrolet": {
        "city": {
          "h1": "Chevrolet Cars for Sale in {city}",
          "title": "Buy and Sell Chevrolet in {city} {'|'} Ambo Market",
          "description": "Chevrolet models available in {city}. Spark, Aveo, Trailblazer and more."
        },
        "everywhere": {
          "h1": "Chevrolet Cars for Sale",
          "title": "Buy and Sell Chevrolet in Angola {'|'} Ambo Market",
          "description": "Search Chevrolet listings across Angola. Reliable sellers and fair prices."
        }
      },
      "nissan": {
        "city": {
          "h1": "Nissan Cars for Sale in {city}",
          "title": "Buy and Sell Nissan in {city} {'|'} Ambo Market",
          "description": "Find popular models like Navara, Patrol, Micra and more in {city}."
        },
        "everywhere": {
          "h1": "Nissan Cars for Sale",
          "title": "Buy and Sell Nissan in Angola {'|'} Ambo Market",
          "description": "Explore Nissan vehicles across Angola. Affordable and reliable."
        }
      },
      "renault": {
        "city": {
          "h1": "Renault Cars in {city}",
          "title": "Buy and Sell Renault in {city} {'|'} Ambo Market",
          "description": "Renault Clio, Duster, Kwid and more – find deals in {city}."
        },
        "everywhere": {
          "h1": "Renault Cars",
          "title": "Buy and Sell Renault in Angola {'|'} Ambo Market",
          "description": "Shop Renault cars in Angola – new and used listings updated daily."
        }
      },
      "ford": {
        "city": {
          "h1": "Ford Cars for Sale in {city}",
          "title": "Buy and Sell Ford in {city} {'|'} Ambo Market",
          "description": "Browse Ford Ranger, EcoSport, Focus and more in {city}."
        },
        "everywhere": {
          "h1": "Ford Cars for Sale",
          "title": "Buy and Sell Ford in Angola {'|'} Ambo Market",
          "description": "Find Ford vehicles for work or personal use across Angola."
        }
      },
      "mercedes": {
        "city": {
          "h1": "Mercedes-Benz Cars in {city}",
          "title": "Buy and Sell Mercedes in {city} {'|'} Ambo Market",
          "description": "Luxury and reliability – explore Mercedes cars in {city}. E-Class, C-Class and more."
        },
        "everywhere": {
          "h1": "Mercedes-Benz Cars",
          "title": "Buy and Sell Mercedes-Benz in Angola {'|'} Ambo Market",
          "description": "Discover Mercedes cars across Angola. Trusted listings only."
        }
      },
      "volkswagen": {
        "city": {
          "h1": "Volkswagen Cars in {city}",
          "title": "Buy and Sell Volkswagen in {city} {'|'} Ambo Market",
          "description": "Find VW Golf, Polo, Passat and more for sale in {city}."
        },
        "everywhere": {
          "h1": "Volkswagen Cars",
          "title": "Buy and Sell Volkswagen in Angola {'|'} Ambo Market",
          "description": "Browse Volkswagen cars across Angola. Post your ad or find deals."
        }
      },
      "bmw": {
        "city": {
          "h1": "BMW Cars in {city}",
          "title": "Buy and Sell BMW in {city} {'|'} Ambo Market",
          "description": "BMW 3 Series, X5, and more available in {city}. Premium listings only."
        },
        "everywhere": {
          "h1": "BMW Cars",
          "title": "Buy and Sell BMW in Angola {'|'} Ambo Market",
          "description": "Explore BMW cars for sale in Angola. Quality used and new models."
        }
      },
      "jetour": {
        "city": {
          "h1": "Jetour Cars for Sale in {city}",
          "title": "Buy and Sell Jetour in {city} {'|'} Ambo Market",
          "description": "Jetour SUVs and crossovers available in {city}. Find great local offers."
        },
        "everywhere": {
          "h1": "Jetour Cars for Sale",
          "title": "Buy and Sell Jetour in Angola {'|'} Ambo Market",
          "description": "Browse Jetour listings across Angola. Affordable and modern options."
        }
      }
    },
    "phones": {
      "other": {
        "city": {
          "h1": "Phones for Sale in {city}",
          "title": "Buy and Sell Mobile Phones in {city} {'|'} Ambo Market",
          "description": "Explore various phone brands in {city}. Post your smartphone ad for free today."
        },
        "everywhere": {
          "h1": "Phones for Sale",
          "title": "Buy and Sell Mobile Phones in Angola {'|'} Ambo Market",
          "description": "Browse listings for phones of all types and brands across Angola. Trusted sellers only."
        }
      },
      "apple": {
        "city": {
          "h1": "iPhones for Sale in {city}",
          "title": "Buy and Sell Apple iPhones in {city} {'|'} Ambo Market",
          "description": "Find iPhones for sale in {city} – iPhone 14, 13, 12 and older models. Great deals available now."
        },
        "everywhere": {
          "h1": "iPhones for Sale",
          "title": "Buy and Sell Apple iPhones in Angola {'|'} Ambo Market",
          "description": "Explore Apple iPhones across Angola – new, used, and refurbished phones."
        }
      },
      "samsung": {
        "city": {
          "h1": "Samsung Phones in {city}",
          "title": "Buy and Sell Samsung Phones in {city} {'|'} Ambo Market",
          "description": "Search for Samsung Galaxy models in {city} – S Series, A Series, Note and more."
        },
        "everywhere": {
          "h1": "Samsung Phones",
          "title": "Buy and Sell Samsung Phones in Angola {'|'} Ambo Market",
          "description": "Samsung smartphones for sale across Angola. New and second-hand options available."
        }
      },
      "itel": {
        "city": {
          "h1": "itel Phones in {city}",
          "title": "Buy and Sell itel Phones in {city} {'|'} Ambo Market",
          "description": "Affordable itel smartphones for sale in {city}. Great for everyday use. Post or explore listings."
        },
        "everywhere": {
          "h1": "itel Phones",
          "title": "Buy and Sell itel Phones in Angola {'|'} Ambo Market",
          "description": "Find cheap and reliable itel phones in Angola. Browse new or used options now."
        }
      },
      "tecno": {
        "city": {
          "h1": "TECNO Phones in {city}",
          "title": "Buy and Sell TECNO Phones in {city} {'|'} Ambo Market",
          "description": "Find TECNO Spark, Camon, Pop and other models for sale in {city}."
        },
        "everywhere": {
          "h1": "TECNO Phones",
          "title": "Buy and Sell TECNO Phones in Angola {'|'} Ambo Market",
          "description": "Explore TECNO smartphones across Angola. Budget-friendly, powerful and trusted."
        }
      },
      "xiaomi": {
        "city": {
          "h1": "Xiaomi Phones in {city}",
          "title": "Buy and Sell Xiaomi Phones in {city} {'|'} Ambo Market",
          "description": "Browse Xiaomi Redmi, Poco, and Mi Series phones for sale in {city}."
        },
        "everywhere": {
          "h1": "Xiaomi Phones",
          "title": "Buy and Sell Xiaomi Phones in Angola {'|'} Ambo Market",
          "description": "Discover Xiaomi phones across Angola. Affordable performance and quality."
        }
      },
      "huawei": {
        "city": {
          "h1": "Huawei Phones in {city}",
          "title": "Buy and Sell Huawei Phones in {city} {'|'} Ambo Market",
          "description": "Huawei Nova, P Series, Mate Series and more for sale in {city}. Post or browse now."
        },
        "everywhere": {
          "h1": "Huawei Phones",
          "title": "Buy and Sell Huawei Phones in Angola {'|'} Ambo Market",
          "description": "Shop Huawei phones across Angola. Find the right model at a great price."
        }
      },
      "oppo": {
        "city": {
          "h1": "OPPO Phones in {city}",
          "title": "Buy and Sell OPPO Phones in {city} {'|'} Ambo Market",
          "description": "OPPO A Series, Reno Series, and more available in {city}. Post your listing free."
        },
        "everywhere": {
          "h1": "OPPO Phones",
          "title": "Buy and Sell OPPO Phones in Angola {'|'} Ambo Market",
          "description": "OPPO phones for sale across Angola – stylish design and strong performance."
        }
      }
    },
    "computers": {
      "other": {
        "city": {
          "h1": "Computers in {city}",
          "title": "Buy and Sell Computers in {city} {'|'} Ambo Market",
          "description": "Browse computers of various brands in {city} – affordable and reliable options available."
        },
        "everywhere": {
          "h1": "Computers in Angola",
          "title": "Buy and Sell Computers in Angola {'|'} Ambo Market",
          "description": "Explore a wide range of computers across Angola – different brands, models and prices."
        }
      },
      "hp": {
        "city": {
          "h1": "HP Computers in {city}",
          "title": "Buy and Sell HP in {city} {'|'} Ambo Market",
          "description": "Find HP laptops and desktops in {city} – Pavilion, EliteBook, ProBook and more."
        },
        "everywhere": {
          "h1": "HP Computers",
          "title": "Buy and Sell HP in Angola {'|'} Ambo Market",
          "description": "Explore HP computers for sale across Angola. New and used devices available."
        }
      },
      "dell": {
        "city": {
          "h1": "Dell Computers in {city}",
          "title": "Buy and Sell Dell in {city} {'|'} Ambo Market",
          "description": "Dell laptops and PCs in {city} – Inspiron, Latitude, XPS and more. Post or browse today."
        },
        "everywhere": {
          "h1": "Dell Computers",
          "title": "Buy and Sell Dell in Angola {'|'} Ambo Market",
          "description": "Discover Dell computers across Angola. Reliable performance for work or home."
        }
      },
      "asus": {
        "city": {
          "h1": "ASUS Computers in {city}",
          "title": "Buy and Sell ASUS in {city} {'|'} Ambo Market",
          "description": "Find ASUS laptops like VivoBook, ZenBook and TUF Gaming in {city}. Great offers."
        },
        "everywhere": {
          "h1": "ASUS Computers",
          "title": "Buy and Sell ASUS in Angola {'|'} Ambo Market",
          "description": "Shop ASUS computers in Angola – for gaming, studying or daily use."
        }
      },
      "lenovo": {
        "city": {
          "h1": "Lenovo Computers in {city}",
          "title": "Buy and Sell Lenovo in {city} {'|'} Ambo Market",
          "description": "Lenovo laptops and desktops – IdeaPad, ThinkPad, Legion and more in {city}."
        },
        "everywhere": {
          "h1": "Lenovo Computers",
          "title": "Buy and Sell Lenovo in Angola {'|'} Ambo Market",
          "description": "Find Lenovo devices for home, work, or gaming. New and used options in Angola."
        }
      },
      "apple": {
        "city": {
          "h1": "Apple Computers in {city}",
          "title": "Buy and Sell Apple MacBook in {city} {'|'} Ambo Market",
          "description": "MacBook Air, MacBook Pro, and iMacs for sale in {city}. Post or browse listings now."
        },
        "everywhere": {
          "h1": "Apple Computers",
          "title": "Buy and Sell Apple in Angola {'|'} Ambo Market",
          "description": "Explore Apple MacBooks and iMacs in Angola. Premium quality and elegant design."
        }
      },
      "acer": {
        "city": {
          "h1": "Acer Computers in {city}",
          "title": "Buy and Sell Acer in {city} {'|'} Ambo Market",
          "description": "Acer laptops – Aspire, Nitro, Swift and more. Find deals in {city}."
        },
        "everywhere": {
          "h1": "Acer Computers",
          "title": "Buy and Sell Acer in Angola {'|'} Ambo Market",
          "description": "Acer computers for all budgets. Explore listings across Angola."
        }
      },
      "msi": {
        "city": {
          "h1": "MSI Computers in {city}",
          "title": "Buy and Sell MSI in {city} {'|'} Ambo Market",
          "description": "MSI laptops and desktops for gaming or professional use in {city}."
        },
        "everywhere": {
          "h1": "MSI Computers",
          "title": "Buy and Sell MSI in Angola {'|'} Ambo Market",
          "description": "Find MSI devices across Angola – powerful and performance-focused."
        }
      },
      "huawei": {
        "city": {
          "h1": "Huawei Computers in {city}",
          "title": "Buy and Sell Huawei in {city} {'|'} Ambo Market",
          "description": "Huawei MateBooks and more available in {city}. Post your ad or explore offers."
        },
        "everywhere": {
          "h1": "Huawei Computers",
          "title": "Buy and Sell Huawei in Angola {'|'} Ambo Market",
          "description": "Discover Huawei laptops in Angola – great design and solid performance."
        }
      }
    },
    "gaming": {
      "sony": {
        "city": {
          "h1": "Sony PlayStation Consoles in {city}",
          "title": "Buy and Sell Sony PlayStation in {city} {'|'} Ambo Market",
          "description": "Find PS5, PS4 and accessories for sale in {city}. Explore local listings or post your own."
        },
        "everywhere": {
          "h1": "Sony PlayStation",
          "title": "Buy and Sell PlayStation in Angola {'|'} Ambo Market",
          "description": "Shop PlayStation consoles and games across Angola. Trusted ads, great prices."
        }
      },
      "microsoft": {
        "city": {
          "h1": "Xbox Consoles in {city}",
          "title": "Buy and Sell Microsoft Xbox in {city} {'|'} Ambo Market",
          "description": "Browse Xbox Series X, Series S, Xbox One and accessories in {city}. Post or explore ads now."
        },
        "everywhere": {
          "h1": "Xbox Consoles",
          "title": "Buy and Sell Xbox in Angola {'|'} Ambo Market",
          "description": "Explore Microsoft Xbox consoles, games and gear available across Angola."
        }
      },
      "nintendo": {
        "city": {
          "h1": "Nintendo Consoles in {city}",
          "title": "Buy and Sell Nintendo in {city} {'|'} Ambo Market",
          "description": "Find Nintendo Switch, Wii, 3DS and more in {city}. Great for casual and family gaming."
        },
        "everywhere": {
          "h1": "Nintendo Consoles",
          "title": "Buy and Sell Nintendo in Angola {'|'} Ambo Market",
          "description": "Browse Nintendo consoles and games for sale across Angola. New and used options available."
        }
      },
      "valve": {
        "city": {
          "h1": "Valve Steam Deck in {city}",
          "title": "Buy and Sell Steam Deck in {city} {'|'} Ambo Market",
          "description": "Portable PC gaming on the go. Explore listings for Steam Deck in {city}. Post your ad or buy now."
        },
        "everywhere": {
          "h1": "Valve Steam Deck",
          "title": "Buy and Sell Steam Deck in Angola {'|'} Ambo Market",
          "description": "Shop Steam Deck across Angola – powerful portable console for PC games."
        }
      },
      "other": {
        "city": {
          "h1": "Game Consoles for Sale in {city}",
          "title": "Buy and Sell Consoles in {city} {'|'} Ambo Market",
          "description": "Looking for other brands or retro consoles in {city}? Post your ad or browse listings."
        },
        "everywhere": {
          "h1": "Game Consoles for Sale",
          "title": "Buy and Sell Consoles in Angola {'|'} Ambo Market",
          "description": "Find gaming consoles from various brands – retro, modern, and portable. Post or explore now."
        }
      }
    }
  },
  "pt": {
    "main_page": "Página inicial",
    "search": {
      "city": {
        "h1": "Anúncios para «{q}» em {city}",
        "title": "{q} em {city} com os Melhores Preços {'|'} Ambo Market",
        "description": "Veja anúncios para {q} em {city}. Compre ou venda com fotos, avaliações e preços acessíveis 💸 em toda Angola. Publique grátis no Ambo Market."
      },
      "everywhere": {
        "h1": "Anúncios para «{q}»",
        "title": "{q} com os Melhores Preços {'|'} Ambo Market",
        "description": "Encontre ofertas para {q} em todo o país. Produtos novos e usados 🤩 com avaliações 💬 e vendedores confiáveis. Anuncie gratuitamente."
      }
    },

    "motorcycles": {
      "other": {
        "city": {
          "h1": "Motos à Venda em {city}",
          "title": "Compre e Venda Motos em {city} {'|'} Ambo Market",
          "description": "Explore anúncios de várias marcas de motas em {city}. Publique seu anúncio gratuitamente."
        },
        "everywhere": {
          "h1": "Motos à Venda",
          "title": "Compre e Venda Motos em Angola {'|'} Ambo Market",
          "description": "Veja motas de diferentes marcas à venda em Angola. Anuncie ou compre com facilidade."
        }
      },
      "honda": {
        "city": {
          "h1": "Motos Honda em {city}",
          "title": "Compre e Venda Motos Honda em {city} {'|'} Ambo Market",
          "description": "Encontre modelos Honda como CG, CBR, Africa Twin e outros em {city}."
        },
        "everywhere": {
          "h1": "Motos Honda",
          "title": "Compre e Venda Motos Honda em Angola {'|'} Ambo Market",
          "description": "Explore anúncios de Honda em toda Angola. Modelos populares e confiáveis."
        }
      },
      "yamaha": {
        "city": {
          "h1": "Motos Yamaha em {city}",
          "title": "Compre e Venda Motos Yamaha em {city} {'|'} Ambo Market",
          "description": "Modelos como YBR, Fazer, MT-07 e mais disponíveis em {city}."
        },
        "everywhere": {
          "h1": "Motos Yamaha",
          "title": "Compre e Venda Motos Yamaha em Angola {'|'} Ambo Market",
          "description": "Veja ofertas de Yamaha em Angola. Publique ou encontre boas oportunidades."
        }
      },
      "suzuki": {
        "city": {
          "h1": "Motos Suzuki em {city}",
          "title": "Compre e Venda Motos Suzuki em {city} {'|'} Ambo Market",
          "description": "Descubra motos Suzuki como GSX, DR-Z e mais em {city}. Anuncie já."
        },
        "everywhere": {
          "h1": "Motos Suzuki",
          "title": "Compre e Venda Motos Suzuki em Angola {'|'} Ambo Market",
          "description": "Anúncios de motos Suzuki em Angola. Encontre modelos novos e usados."
        }
      },
      "kawasaki": {
        "city": {
          "h1": "Motos Kawasaki em {city}",
          "title": "Compre e Venda Motos Kawasaki em {city} {'|'} Ambo Market",
          "description": "Veja modelos Kawasaki como Ninja, Versys, Z e outros em {city}."
        },
        "everywhere": {
          "h1": "Motos Kawasaki",
          "title": "Compre e Venda Motos Kawasaki em Angola {'|'} Ambo Market",
          "description": "Ofertas de Kawasaki em Angola. Potência, estilo e confiança em duas rodas."
        }
      },
      "vespa": {
        "city": {
          "h1": "Scooters Vespa em {city}",
          "title": "Compre e Venda Vespa em {city} {'|'} Ambo Market",
          "description": "Clássica e elegante – encontre scooters Vespa em {city}. Anuncie gratuitamente."
        },
        "everywhere": {
          "h1": "Scooters Vespa",
          "title": "Compre e Venda Vespa em Angola {'|'} Ambo Market",
          "description": "Descubra o charme da Vespa em Angola. Scooters novas e usadas à venda."
        }
      },
      "ducati": {
        "city": {
          "h1": "Motos Ducati em {city}",
          "title": "Compre e Venda Motos Ducati em {city} {'|'} Ambo Market",
          "description": "Performance italiana em duas rodas – veja Ducati Monster, Multistrada e outros."
        },
        "everywhere": {
          "h1": "Motos Ducati",
          "title": "Compre e Venda Motos Ducati em Angola {'|'} Ambo Market",
          "description": "Encontre motos Ducati à venda em Angola. Estilo e velocidade incomparáveis."
        }
      },
      "bmw-motorrad": {
        "city": {
          "h1": "BMW Motorrad em {city}",
          "title": "Compre e Venda BMW Motorrad em {city} {'|'} Ambo Market",
          "description": "Descubra motos BMW como GS, F 850, R 1250 e mais em {city}. Anuncie já."
        },
        "everywhere": {
          "h1": "BMW Motorrad",
          "title": "Compre e Venda BMW Motorrad em Angola {'|'} Ambo Market",
          "description": "Motos premium da BMW à venda em Angola. Conforto, potência e tecnologia."
        }
      },
      "harley-davidson": {
        "city": {
          "h1": "Harley-Davidson em {city}",
          "title": "Compre e Venda Harley-Davidson em {city} {'|'} Ambo Market",
          "description": "Clássicos americanos como Sportster, Softail, Road King e outros em {city}."
        },
        "everywhere": {
          "h1": "Harley-Davidson",
          "title": "Compre e Venda Harley-Davidson em Angola {'|'} Ambo Market",
          "description": "Sinta a liberdade com uma Harley-Davidson. Veja ofertas em Angola."
        }
      },
      "aprilia": {
        "city": {
          "h1": "Motos Aprilia em {city}",
          "title": "Compre e Venda Motos Aprilia em {city} {'|'} Ambo Market",
          "description": "Motos Aprilia como RSV4, Tuareg e SR GT disponíveis em {city}."
        },
        "everywhere": {
          "h1": "Motos Aprilia",
          "title": "Compre e Venda Motos Aprilia em Angola {'|'} Ambo Market",
          "description": "Desempenho italiano e design marcante – veja Aprilia em Angola."
        }
      }
    },
    "cars": {
      "other": {
        "city": {
          "h1": "Carros à Venda em {city}",
          "title": "Compre e Venda Carros em {city} {'|'} Ambo Market",
          "description": "Veja ofertas de diversas marcas de carros em {city}. Anuncie o seu gratuitamente."
        },
        "everywhere": {
          "h1": "Carros à Venda",
          "title": "Compre e Venda Carros em Angola {'|'} Ambo Market",
          "description": "Encontre carros de várias marcas à venda em Angola. Publique ou explore anúncios com facilidade."
        }
      },
      "toyota": {
        "city": {
          "h1": "Toyota à Venda em {city}",
          "title": "Compre e Venda Toyota em {city} {'|'} Ambo Market",
          "description": "Modelos como Hilux, Corolla e Land Cruiser em {city}. Apenas vendedores confiáveis."
        },
        "everywhere": {
          "h1": "Toyota à Venda",
          "title": "Compre e Venda Toyota em Angola {'|'} Ambo Market",
          "description": "Ofertas de Toyota em toda Angola – desde modelos económicos até premium."
        }
      },
      "suzuki": {
        "city": {
          "h1": "Suzuki à Venda em {city}",
          "title": "Compre e Venda Suzuki em {city} {'|'} Ambo Market",
          "description": "Veja anúncios de Suzuki Swift, Vitara, Jimny e outros em {city}."
        },
        "everywhere": {
          "h1": "Suzuki à Venda",
          "title": "Compre e Venda Suzuki em Angola {'|'} Ambo Market",
          "description": "Encontre ofertas de Suzuki em Angola. Vendedores verificados e bons preços."
        }
      },
      "hyundai": {
        "city": {
          "h1": "Hyundai à Venda em {city}",
          "title": "Compre e Venda Hyundai em {city} {'|'} Ambo Market",
          "description": "Veja modelos Hyundai como Tucson, Accent e Elantra em {city}."
        },
        "everywhere": {
          "h1": "Hyundai à Venda",
          "title": "Compre e Venda Hyundai em Angola {'|'} Ambo Market",
          "description": "Carros Hyundai novos e usados à venda em toda Angola."
        }
      },
      "kia": {
        "city": {
          "h1": "Kia à Venda em {city}",
          "title": "Compre e Venda Kia em {city} {'|'} Ambo Market",
          "description": "Procura por Kia Sportage, Rio, Picanto e mais em {city}."
        },
        "everywhere": {
          "h1": "Kia à Venda",
          "title": "Compre e Venda Kia em Angola {'|'} Ambo Market",
          "description": "Kia à venda em Angola. Veja ou publique anúncios facilmente."
        }
      },
      "mitsubishi": {
        "city": {
          "h1": "Mitsubishi em {city}",
          "title": "Compre e Venda Mitsubishi em {city} {'|'} Ambo Market",
          "description": "Veja Pajero, L200 e outros modelos Mitsubishi em {city}. Anuncie de graça."
        },
        "everywhere": {
          "h1": "Mitsubishi",
          "title": "Compre e Venda Mitsubishi em Angola {'|'} Ambo Market",
          "description": "Modelos Mitsubishi disponíveis em toda Angola. Anúncios verificados."
        }
      },
      "chevrolet": {
        "city": {
          "h1": "Chevrolet à Venda em {city}",
          "title": "Compre e Venda Chevrolet em {city} {'|'} Ambo Market",
          "description": "Veja Chevrolet Spark, Aveo, Trailblazer e mais em {city}."
        },
        "everywhere": {
          "h1": "Chevrolet à Venda",
          "title": "Compre e Venda Chevrolet em Angola {'|'} Ambo Market",
          "description": "Anúncios de Chevrolet em Angola. Bons preços e vendedores confiáveis."
        }
      },
      "nissan": {
        "city": {
          "h1": "Nissan à Venda em {city}",
          "title": "Compre e Venda Nissan em {city} {'|'} Ambo Market",
          "description": "Encontre modelos como Navara, Patrol, Micra e outros em {city}."
        },
        "everywhere": {
          "h1": "Nissan à Venda",
          "title": "Compre e Venda Nissan em Angola {'|'} Ambo Market",
          "description": "Veja anúncios de Nissan em toda Angola. Ótimos preços e boa oferta."
        }
      },
      "renault": {
        "city": {
          "h1": "Renault em {city}",
          "title": "Compre e Venda Renault em {city} {'|'} Ambo Market",
          "description": "Clio, Duster, Kwid e mais disponíveis em {city}."
        },
        "everywhere": {
          "h1": "Renault",
          "title": "Compre e Venda Renault em Angola {'|'} Ambo Market",
          "description": "Anúncios atualizados de Renault em toda Angola. Novos e usados."
        }
      },
      "ford": {
        "city": {
          "h1": "Ford à Venda em {city}",
          "title": "Compre e Venda Ford em {city} {'|'} Ambo Market",
          "description": "Modelos como Ranger, EcoSport, Focus disponíveis em {city}."
        },
        "everywhere": {
          "h1": "Ford à Venda",
          "title": "Compre e Venda Ford em Angola {'|'} Ambo Market",
          "description": "Ford para uso pessoal ou profissional. Veja anúncios em Angola."
        }
      },
      "mercedes": {
        "city": {
          "h1": "Mercedes-Benz em {city}",
          "title": "Compre e Venda Mercedes em {city} {'|'} Ambo Market",
          "description": "Modelos como E-Class, C-Class e outros à venda em {city}."
        },
        "everywhere": {
          "h1": "Mercedes-Benz",
          "title": "Compre e Venda Mercedes-Benz em Angola {'|'} Ambo Market",
          "description": "Explore carros Mercedes em Angola. Anúncios de confiança."
        }
      },
      "volkswagen": {
        "city": {
          "h1": "Volkswagen em {city}",
          "title": "Compre e Venda Volkswagen em {city} {'|'} Ambo Market",
          "description": "Modelos VW como Golf, Polo, Passat disponíveis em {city}."
        },
        "everywhere": {
          "h1": "Volkswagen",
          "title": "Compre e Venda Volkswagen em Angola {'|'} Ambo Market",
          "description": "Volkswagen à venda em Angola. Anuncie ou explore boas ofertas."
        }
      },
      "bmw": {
        "city": {
          "h1": "BMW em {city}",
          "title": "Compre e Venda BMW em {city} {'|'} Ambo Market",
          "description": "Modelos BMW Série 3, X5 e mais à venda em {city}. Carros premium."
        },
        "everywhere": {
          "h1": "BMW",
          "title": "Compre e Venda BMW em Angola {'|'} Ambo Market",
          "description": "Veja carros BMW em Angola. Novos e usados, sempre com qualidade."
        }
      },
      "jetour": {
        "city": {
          "h1": "Jetour à Venda em {city}",
          "title": "Compre e Venda Jetour em {city} {'|'} Ambo Market",
          "description": "SUVs e crossovers Jetour disponíveis em {city}. Ótimas ofertas locais."
        },
        "everywhere": {
          "h1": "Jetour à Venda",
          "title": "Compre e Venda Jetour em Angola {'|'} Ambo Market",
          "description": "Jetour à venda em Angola. Modernos, acessíveis e com bom custo-benefício."
        }
      }
    },
    "phones": {
      "other": {
        "city": {
          "h1": "Telemóveis à Venda em {city}",
          "title": "Compre e Venda Telemóveis em {city} {'|'} Ambo Market",
          "description": "Explore anúncios de várias marcas de telemóveis em {city}. Publique o seu gratuitamente."
        },
        "everywhere": {
          "h1": "Telemóveis à Venda",
          "title": "Compre e Venda Telemóveis em Angola {'|'} Ambo Market",
          "description": "Veja telemóveis de todas as marcas à venda em Angola. Apenas anúncios verificados."
        }
      },
      "apple": {
        "city": {
          "h1": "iPhones à Venda em {city}",
          "title": "Compre e Venda Apple iPhones em {city} {'|'} Ambo Market",
          "description": "Encontre iPhones à venda em {city} – modelos 14, 13, 12 e mais. Boas ofertas disponíveis."
        },
        "everywhere": {
          "h1": "iPhones à Venda",
          "title": "Compre e Venda Apple iPhones em Angola {'|'} Ambo Market",
          "description": "Explore iPhones novos, usados e recondicionados em toda Angola."
        }
      },
      "samsung": {
        "city": {
          "h1": "Telemóveis Samsung em {city}",
          "title": "Compre e Venda Samsung em {city} {'|'} Ambo Market",
          "description": "Procure modelos Samsung Galaxy – S, A, Note e outros em {city}."
        },
        "everywhere": {
          "h1": "Telemóveis Samsung",
          "title": "Compre e Venda Samsung em Angola {'|'} Ambo Market",
          "description": "Telemóveis Samsung à venda em Angola. Novos e usados disponíveis."
        }
      },
      "itel": {
        "city": {
          "h1": "Telemóveis itel em {city}",
          "title": "Compre e Venda itel em {city} {'|'} Ambo Market",
          "description": "Telemóveis itel baratos à venda em {city}. Perfeitos para uso diário. Anuncie ou compre agora."
        },
        "everywhere": {
          "h1": "Telemóveis itel",
          "title": "Compre e Venda itel em Angola {'|'} Ambo Market",
          "description": "Encontre opções económicas e confiáveis de itel em Angola. Novos e usados."
        }
      },
      "tecno": {
        "city": {
          "h1": "Telemóveis TECNO em {city}",
          "title": "Compre e Venda TECNO em {city} {'|'} Ambo Market",
          "description": "Encontre modelos TECNO Spark, Camon, Pop e outros em {city}. Boas ofertas."
        },
        "everywhere": {
          "h1": "Telemóveis TECNO",
          "title": "Compre e Venda TECNO em Angola {'|'} Ambo Market",
          "description": "Explore smartphones TECNO em Angola. Potência, preço justo e qualidade."
        }
      },
      "xiaomi": {
        "city": {
          "h1": "Telemóveis Xiaomi em {city}",
          "title": "Compre e Venda Xiaomi em {city} {'|'} Ambo Market",
          "description": "Veja modelos Xiaomi Redmi, Poco e Mi Series à venda em {city}."
        },
        "everywhere": {
          "h1": "Telemóveis Xiaomi",
          "title": "Compre e Venda Xiaomi em Angola {'|'} Ambo Market",
          "description": "Telemóveis Xiaomi com ótimo desempenho e preços acessíveis em Angola."
        }
      },
      "huawei": {
        "city": {
          "h1": "Telemóveis Huawei em {city}",
          "title": "Compre e Venda Huawei em {city} {'|'} Ambo Market",
          "description": "Huawei Nova, P Series, Mate Series e mais à venda em {city}. Publique ou compre agora."
        },
        "everywhere": {
          "h1": "Telemóveis Huawei",
          "title": "Compre e Venda Huawei em Angola {'|'} Ambo Market",
          "description": "Veja ofertas de Huawei em toda Angola. Modelos novos e usados disponíveis."
        }
      },
      "oppo": {
        "city": {
          "h1": "Telemóveis OPPO em {city}",
          "title": "Compre e Venda OPPO em {city} {'|'} Ambo Market",
          "description": "Modelos OPPO A Series, Reno Series e outros disponíveis em {city}. Publique seu anúncio."
        },
        "everywhere": {
          "h1": "Telemóveis OPPO",
          "title": "Compre e Venda OPPO em Angola {'|'} Ambo Market",
          "description": "Telemóveis OPPO à venda em Angola – design moderno e bom desempenho."
        }
      }
    },
    "computers": {
      "other": {
        "city": {
          "h1": "Computadores em {city}",
          "title": "Comprar e Vender Computadores em {city} {'|'} Ambo Market",
          "description": "Veja computadores de várias marcas em {city} – opções acessíveis e confiáveis disponíveis."
        },
        "everywhere": {
          "h1": "Computadores em Angola",
          "title": "Comprar e Vender Computadores em Angola {'|'} Ambo Market",
          "description": "Explore uma ampla variedade de computadores em Angola – diferentes marcas, modelos e preços."
        }
      },
      "hp": {
        "city": {
          "h1": "Computadores HP em {city}",
          "title": "Compre e Venda HP em {city} {'|'} Ambo Market",
          "description": "Encontre laptops e PCs HP em {city} – modelos Pavilion, EliteBook, ProBook e mais."
        },
        "everywhere": {
          "h1": "Computadores HP",
          "title": "Compre e Venda HP em Angola {'|'} Ambo Market",
          "description": "Explore computadores HP à venda em toda Angola. Novos e usados com bons preços."
        }
      },
      "dell": {
        "city": {
          "h1": "Computadores Dell em {city}",
          "title": "Compre e Venda Dell em {city} {'|'} Ambo Market",
          "description": "Dell Inspiron, Latitude, XPS e outros modelos disponíveis em {city}. Publique ou compre."
        },
        "everywhere": {
          "h1": "Computadores Dell",
          "title": "Compre e Venda Dell em Angola {'|'} Ambo Market",
          "description": "Descubra laptops e desktops Dell em Angola. Alta performance e confiabilidade."
        }
      },
      "asus": {
        "city": {
          "h1": "Computadores ASUS em {city}",
          "title": "Compre e Venda ASUS em {city} {'|'} Ambo Market",
          "description": "Veja modelos ASUS como VivoBook, ZenBook e TUF Gaming à venda em {city}."
        },
        "everywhere": {
          "h1": "Computadores ASUS",
          "title": "Compre e Venda ASUS em Angola {'|'} Ambo Market",
          "description": "Computadores ASUS para trabalho, estudos ou jogos disponíveis em Angola."
        }
      },
      "lenovo": {
        "city": {
          "h1": "Computadores Lenovo em {city}",
          "title": "Compre e Venda Lenovo em {city} {'|'} Ambo Market",
          "description": "Modelos Lenovo Ideapad, ThinkPad, Legion e mais em {city}. Boas ofertas."
        },
        "everywhere": {
          "h1": "Computadores Lenovo",
          "title": "Compre e Venda Lenovo em Angola {'|'} Ambo Market",
          "description": "Encontre Lenovo para negócios, casa ou jogos em Angola. Novos e usados."
        }
      },
      "apple": {
        "city": {
          "h1": "Computadores Apple em {city}",
          "title": "Compre e Venda Apple MacBook em {city} {'|'} Ambo Market",
          "description": "Encontre MacBook Air, MacBook Pro e iMacs em {city}. Postar ou comprar com segurança."
        },
        "everywhere": {
          "h1": "Computadores Apple",
          "title": "Compre e Venda Apple em Angola {'|'} Ambo Market",
          "description": "Explore Apple MacBooks e iMacs em Angola. Tecnologia premium e design elegante."
        }
      },
      "acer": {
        "city": {
          "h1": "Computadores Acer em {city}",
          "title": "Compre e Venda Acer em {city} {'|'} Ambo Market",
          "description": "Laptops Acer Aspire, Nitro, Swift e mais à venda em {city}."
        },
        "everywhere": {
          "h1": "Computadores Acer",
          "title": "Compre e Venda Acer em Angola {'|'} Ambo Market",
          "description": "Computadores Acer para todos os orçamentos. Explore ofertas em Angola."
        }
      },
      "msi": {
        "city": {
          "h1": "Computadores MSI em {city}",
          "title": "Compre e Venda MSI em {city} {'|'} Ambo Market",
          "description": "Portáteis e desktops MSI para gamers e profissionais em {city}."
        },
        "everywhere": {
          "h1": "Computadores MSI",
          "title": "Compre e Venda MSI em Angola {'|'} Ambo Market",
          "description": "MSI à venda em Angola – alto desempenho para jogos e criação de conteúdo."
        }
      },
      "huawei": {
        "city": {
          "h1": "Computadores Huawei em {city}",
          "title": "Compre e Venda Huawei em {city} {'|'} Ambo Market",
          "description": "Laptops Huawei MateBook e outros modelos disponíveis em {city}."
        },
        "everywhere": {
          "h1": "Computadores Huawei",
          "title": "Compre e Venda Huawei em Angola {'|'} Ambo Market",
          "description": "Encontre Huawei MateBooks com ótimo design e performance em Angola."
        }
      }
    },
    "gaming": {
      "sony": {
        "city": {
          "h1": "PlayStation da Sony em {city}",
          "title": "Compre e Venda PlayStation em {city} {'|'} Ambo Market",
          "description": "Encontre PS5, PS4 e acessórios à venda em {city}. Explore os anúncios ou publique o seu."
        },
        "everywhere": {
          "h1": "PlayStation da Sony",
          "title": "Compre e Venda PlayStation em Angola {'|'} Ambo Market",
          "description": "Consolas e jogos PlayStation à venda em toda Angola. Anúncios verificados e bons preços."
        }
      },
      "microsoft": {
        "city": {
          "h1": "Consolas Xbox em {city}",
          "title": "Compre e Venda Xbox da Microsoft em {city} {'|'} Ambo Market",
          "description": "Veja Xbox Series X, Series S, Xbox One e acessórios em {city}. Publique ou explore anúncios."
        },
        "everywhere": {
          "h1": "Consolas Xbox",
          "title": "Compre e Venda Xbox em Angola {'|'} Ambo Market",
          "description": "Explore consolas, jogos e acessórios Xbox disponíveis em Angola."
        }
      },
      "nintendo": {
        "city": {
          "h1": "Consolas Nintendo em {city}",
          "title": "Compre e Venda Nintendo em {city} {'|'} Ambo Market",
          "description": "Encontre Nintendo Switch, Wii, 3DS e mais em {city}. Ótimas opções para toda a família."
        },
        "everywhere": {
          "h1": "Consolas Nintendo",
          "title": "Compre e Venda Nintendo em Angola {'|'} Ambo Market",
          "description": "Consolas e jogos Nintendo à venda em Angola. Novos e usados disponíveis."
        }
      },
      "valve": {
        "city": {
          "h1": "Steam Deck da Valve em {city}",
          "title": "Compre e Venda Steam Deck em {city} {'|'} Ambo Market",
          "description": "Jogue onde quiser com o Steam Deck. Veja anúncios em {city} ou publique o seu."
        },
        "everywhere": {
          "h1": "Steam Deck da Valve",
          "title": "Compre e Venda Steam Deck em Angola {'|'} Ambo Market",
          "description": "Compre o Steam Deck em Angola – consola portátil de alto desempenho para jogos de PC."
        }
      },
      "other": {
        "city": {
          "h1": "Consolas de Jogo à Venda em {city}",
          "title": "Compre e Venda Consolas em {city} {'|'} Ambo Market",
          "description": "Procura consolas de outras marcas ou modelos retro em {city}? Publique ou veja anúncios agora."
        },
        "everywhere": {
          "h1": "Consolas de Jogo à Venda",
          "title": "Compre e Venda Consolas em Angola {'|'} Ambo Market",
          "description": "Consolas modernas, portáteis e clássicas à venda em Angola. Explore ou anuncie já."
        }
      }
    }
  }
}
</i18n>

<template>
  <div :class="$style.root">
    <UIBreadcrumbs :items="breadcrumbs" />

    <h1
      :class="$style.title"
      v-text="seo.h1"
    />

    <div :class="$style.content">
      <div :class="$style.left">
        <FilterBlock :class="$style.filter" />
      </div>

      <div :class="$style.main">
        <ProductList
          :list="posts?.posts"
          :isLoading="isLoading"
        />

        <UIPagination
          v-if="hasPagination"
          :view="3"
          :value="page"
          :max="totalPages"
          :class="$style.pagination"
          @input="setPage"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  @include ui-simple-container;

  padding: 10px 20px;
}

.title {
  @include ui-typo-32-bold;

  margin-top: 10px;
}

.content {
  margin-top: 14px; // 20 - 6
  display: flex;
}

.left {
  position: relative;
  flex: 280px 0;
  max-width: 280px;
  margin-right: 20px;

  @include md {
    display: none;
  }
}

.filter {
  position: sticky;
  top: (64px + 10px);
  margin: 6px 0;
}

.main {
  flex: 1 1;
  min-width: 0;
}

.pagination {
  margin-top: 20px;
}
</style>

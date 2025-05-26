<script setup lang="ts">
import { usePosts } from '~/composables/usePosts';
import { getCityById } from '~/constants/cities';
import { MAX_POSTS_PER_PAGE } from '~/composables/usePosts/constants';


definePageMeta({
  middleware: [
    'validate-city',
    'validate-subcategory',
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

  const searchQuery = getFilter('q');
  const subcategoryId = route.params.subcategoryId;

  if (searchQuery) {
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

    breadcrumbs.push({ title: searchQuery });
  } else {
    breadcrumbs.push({ title: t(`subcategories.${subcategoryId}`) });
  }

  return breadcrumbs;
});

const seo = computed(() => {
  const searchQuery = getFilter('q');

  let translationKey;

  if (searchQuery) {
    translationKey = isPriorityCity.value ? 'search.city' : 'search.everywhere';
  } else {
    const categoryId = route.params.categoryId;
    const subcategoryId = route.params.subcategoryId;

    const cityKey = isPriorityCity.value ? 'city' : 'everywhere';

    translationKey = `${categoryId}.${subcategoryId}.${cityKey}`;
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
    "vehicles": {
      "cars": {
        "city": {
          "h1": "Cars for Sale in {city}",
          "title": "Buy and Sell Cars in {city} {'|'} Ambo Market",
          "description": "Find new and used cars for sale in {city}. Compare prices, read reviews, and contact verified sellers. Post your car ad for free."
        },
        "everywhere": {
          "h1": "Cars for Sale",
          "title": "Buy and Sell Cars in Angola {'|'} Ambo Market",
          "description": "Find new and used cars for sale across Angola. Compare prices, read reviews, and contact verified sellers. Post your car ad for free."
        }
      },
      "motorcycles": {
        "city": {
          "h1": "Motorcycles for Sale in {city}",
          "title": "Buy and Sell Motorcycles in {city} {'|'} Ambo Market",
          "description": "Browse motorcycle listings in {city}. Discover scooters, bikes and more. Connect with trusted sellers or post your own motorcycle for free."
        },
        "everywhere": {
          "h1": "Motorcycles for Sale",
          "title": "Buy and Sell Motorcycles in Angola {'|'} Ambo Market",
          "description": "Browse motorcycle listings across Angola. Discover scooters, bikes and more. Connect with trusted sellers or post your own motorcycle for free."
        }
      },
      "commercial": {
        "city": {
          "h1": "Commercial Vehicles in {city}",
          "title": "Trucks, Vans and Commercial Vehicles in {city} {'|'} Ambo Market",
          "description": "Find commercial vehicles for work and business in {city}. Browse trucks, vans, and transport options from verified sellers."
        },
        "everywhere": {
          "h1": "Commercial Vehicles",
          "title": "Trucks, Vans and Commercial Vehicles in Angola {'|'} Ambo Market",
          "description": "Find commercial vehicles for work and business across Angola. Browse trucks, vans, and transport options from verified sellers."
        }
      },
      "boats": {
        "city": {
          "h1": "Boats and Watercraft in {city}",
          "title": "Buy and Sell Boats in {city} {'|'} Ambo Market",
          "description": "Explore boat listings in {city}. Find fishing boats, motorboats and other watercraft for sale. Post your boat ad for free."
        },
        "everywhere": {
          "h1": "Boats and Watercraft",
          "title": "Buy and Sell Boats in Angola {'|'} Ambo Market",
          "description": "Explore boat listings across Angola. Find fishing boats, motorboats and other watercraft for sale. Post your boat ad for free."
        }
      },
      "parts": {
        "city": {
          "h1": "Auto Parts in {city}",
          "title": "Buy Car Parts and Accessories in {city} {'|'} Ambo Market",
          "description": "Search for car parts, tires, batteries and more in {city}. Sell or buy auto parts easily from trusted users."
        },
        "everywhere": {
          "h1": "Auto Parts",
          "title": "Buy Car Parts and Accessories in Angola {'|'} Ambo Market",
          "description": "Search for car parts, tires, batteries and more across Angola. Sell or buy auto parts easily from trusted users."
        }
      }
    },
    "real-estate": {
      "rent": {
        "city": {
          "h1": "Property for Rent in {city}",
          "title": "Houses and Apartments for Rent in {city} {'|'} Ambo Market",
          "description": "Find rental homes, apartments and rooms in {city}. Affordable options for long-term or short stays. Post your rental listing free."
        },
        "everywhere": {
          "h1": "Property for Rent",
          "title": "Houses and Apartments for Rent in Angola {'|'} Ambo Market",
          "description": "Browse rental listings across Angola. Homes, rooms and flats for any budget. Rent or advertise easily on Ambo Market."
        }
      },
      "sale": {
        "city": {
          "h1": "Property for Sale in {city}",
          "title": "Buy Homes and Land in {city} {'|'} Ambo Market",
          "description": "Explore houses, apartments, and land for sale in {city}. Verified sellers and great deals. Post your property for free."
        },
        "everywhere": {
          "h1": "Property for Sale",
          "title": "Homes, Apartments and Land for Sale in Angola {'|'} Ambo Market",
          "description": "Buy property across Angola – houses, apartments and land. Post or browse listings for free."
        }
      },
      "commercial": {
        "city": {
          "h1": "Commercial Real Estate in {city}",
          "title": "Offices, Shops and Warehouses in {city} {'|'} Ambo Market",
          "description": "Find commercial property for sale or rent in {city}. Offices, retail spaces, warehouses and more. Post your business listing free."
        },
        "everywhere": {
          "h1": "Commercial Real Estate",
          "title": "Offices, Shops and Warehouses in Angola {'|'} Ambo Market",
          "description": "Discover commercial spaces across Angola. Buy or rent offices, shops and more. Free listings on Ambo Market."
        }
      },
      "land": {
        "city": {
          "h1": "Land for Sale in {city}",
          "title": "Buy Plots and Land in {city} {'|'} Ambo Market",
          "description": "Looking for land in {city}? Agricultural, residential and commercial plots for sale. List your land for free today."
        },
        "everywhere": {
          "h1": "Land for Sale",
          "title": "Buy Land and Plots in Angola {'|'} Ambo Market",
          "description": "Search for land offers across Angola. Perfect for investment or development. Sell your land easily and for free."
        }
      }
    },
    "electronics": {
      "phones": {
        "city": {
          "h1": "Phones for Sale in {city}",
          "title": "Buy Smartphones in {city} {'|'} Ambo Market",
          "description": "Discover deals on new and used phones in {city}. Browse iPhones, Android devices and more. Post your phone ad for free."
        },
        "everywhere": {
          "h1": "Phones for Sale",
          "title": "Buy Smartphones in Angola {'|'} Ambo Market",
          "description": "Buy and sell phones across Angola. Find great prices on smartphones. Post your listing today for free."
        }
      },
      "computers": {
        "city": {
          "h1": "Computers and Laptops in {city}",
          "title": "Buy Laptops, PCs and Accessories in {city} {'|'} Ambo Market",
          "description": "Explore listings for laptops, desktops and accessories in {city}. Find trusted deals and post your computer for sale for free."
        },
        "everywhere": {
          "h1": "Computers and Laptops",
          "title": "Buy Laptops, PCs and Accessories in Angola {'|'} Ambo Market",
          "description": "Shop new and used computers, monitors and more. Browse Angola-wide listings or sell your device now."
        }
      },
      "gaming": {
        "city": {
          "h1": "Gaming Gear in {city}",
          "title": "Buy Consoles, Games and Accessories in {city} {'|'} Ambo Market",
          "description": "Find gaming consoles, controllers and video games in {city}. PS5, Xbox, Nintendo and more. Sell or buy fast and free."
        },
        "everywhere": {
          "h1": "Gaming Gear",
          "title": "Buy Consoles, Games and Accessories in Angola {'|'} Ambo Market",
          "description": "Buy and sell gaming equipment across Angola. Explore PS5, Xbox, and PC gaming offers today."
        }
      },
      "tv-audio-photo": {
        "city": {
          "h1": "TV, Audio & Photo in {city}",
          "title": "Buy TVs, Speakers and Cameras in {city} {'|'} Ambo Market",
          "description": "Browse electronics like televisions, sound systems and cameras in {city}. Sell your gear for free or find great deals today."
        },
        "everywhere": {
          "h1": "TV, Audio & Photo",
          "title": "Buy TVs, Speakers and Cameras in Angola {'|'} Ambo Market",
          "description": "Explore offers on electronics for home or work. TV sets, audio gear, and cameras across Angola."
        }
      },
      "appliances": {
        "city": {
          "h1": "Home Appliances in {city}",
          "title": "Buy Fridges, Washers and Ovens in {city} {'|'} Ambo Market",
          "description": "Find kitchen and laundry appliances in {city}. Post your ad for free or shop second-hand options."
        },
        "everywhere": {
          "h1": "Home Appliances",
          "title": "Buy Fridges, Washers and Ovens in Angola {'|'} Ambo Market",
          "description": "Shop appliances across Angola. Refrigerators, cookers, washing machines and more. Post your ad free."
        }
      },
      "accessories-electronics": {
        "city": {
          "h1": "Electronics Accessories in {city}",
          "title": "Buy Chargers, Cables, and Gadgets in {city} {'|'} Ambo Market",
          "description": "Browse affordable accessories for phones, computers and TVs in {city}. Find cables, cases, remotes and more."
        },
        "everywhere": {
          "h1": "Electronics Accessories",
          "title": "Buy Chargers, Cables, and Gadgets in Angola {'|'} Ambo Market",
          "description": "Find electronics accessories across Angola. Post or browse listings for adapters, memory cards and more."
        }
      }
    },
    "fashion": {
      "men": {
        "city": {
          "h1": "Men’s Fashion in {city}",
          "title": "Buy Men’s Clothes and Accessories in {city} {'|'} Ambo Market",
          "description": "Shop jackets, shirts, trousers and more for men in {city}. Find stylish and affordable fashion or post your own listing free."
        },
        "everywhere": {
          "h1": "Men’s Fashion",
          "title": "Buy Men’s Clothes and Accessories in Angola {'|'} Ambo Market",
          "description": "Discover men’s fashion across Angola. Post or browse listings for jackets, shirts, pants and shoes."
        }
      },
      "women": {
        "city": {
          "h1": "Women’s Fashion in {city}",
          "title": "Buy Dresses, Tops and Accessories in {city} {'|'} Ambo Market",
          "description": "Find women’s clothing and accessories for sale in {city}. Browse dresses, blouses, handbags and more. Post your fashion ad for free."
        },
        "everywhere": {
          "h1": "Women’s Fashion",
          "title": "Buy Dresses, Tops and Accessories in Angola {'|'} Ambo Market",
          "description": "Shop stylish clothes and accessories for women across Angola. Sell your fashion items or discover great deals."
        }
      },
      "shoes": {
        "city": {
          "h1": "Shoes for Sale in {city}",
          "title": "Buy Men’s and Women’s Shoes in {city} {'|'} Ambo Market",
          "description": "Discover shoes for all occasions in {city}. Sneakers, heels, boots and more – new or second-hand. Post your shoe ad for free."
        },
        "everywhere": {
          "h1": "Shoes for Sale",
          "title": "Buy Men’s and Women’s Shoes in Angola {'|'} Ambo Market",
          "description": "Explore a wide variety of shoes for sale across Angola. Post your ad or find footwear at great prices."
        }
      },
      "bags": {
        "city": {
          "h1": "Bags and Backpacks in {city}",
          "title": "Buy Handbags, Backpacks and More in {city} {'|'} Ambo Market",
          "description": "Browse listings for women’s handbags, school backpacks, travel bags and more in {city}. Sell or shop easily on Ambo Market."
        },
        "everywhere": {
          "h1": "Bags and Backpacks",
          "title": "Buy Handbags, Backpacks and More in Angola {'|'} Ambo Market",
          "description": "Find new and used bags for work, school or travel. Post your bag for sale or browse offers in Angola."
        }
      },
      "accessories-fashion": {
        "city": {
          "h1": "Fashion Accessories in {city}",
          "title": "Buy Watches, Jewelry and Sunglasses in {city} {'|'} Ambo Market",
          "description": "Complete your look with stylish accessories. Browse jewelry, hats, belts and more in {city}."
        },
        "everywhere": {
          "h1": "Fashion Accessories",
          "title": "Buy Watches, Jewelry and Sunglasses in Angola {'|'} Ambo Market",
          "description": "Find the perfect accessory. Shop watches, earrings, sunglasses and more across Angola."
        }
      },
      "beauty-products": {
        "city": {
          "h1": "Beauty Products in {city}",
          "title": "Buy Perfume, Makeup and Skincare in {city} {'|'} Ambo Market",
          "description": "Browse cosmetics, haircare and wellness products in {city}. Great for personal use or resale. Post your beauty items free."
        },
        "everywhere": {
          "h1": "Beauty Products",
          "title": "Buy Perfume, Makeup and Skincare in Angola {'|'} Ambo Market",
          "description": "Shop beauty and health products across Angola. Post ads for makeup, haircare and wellness today."
        }
      }
    },
    "jobs": {
      "vacancies": {
        "city": {
          "h1": "Job Vacancies in {city}",
          "title": "Apply for Jobs in {city} {'|'} Ambo Market",
          "description": "Browse job openings from employers in {city}. Full-time, part-time, freelance and remote roles available. Apply or post your vacancy for free."
        },
        "everywhere": {
          "h1": "Job Vacancies",
          "title": "Apply for Jobs in Angola {'|'} Ambo Market",
          "description": "Explore job listings across Angola. Find your next opportunity or post a vacancy for free."
        }
      },
      "resumes": {
        "city": {
          "h1": "Job Seekers in {city}",
          "title": "Browse Resumes in {city} {'|'} Ambo Market",
          "description": "Find professionals looking for work in {city}. Explore resumes by industry, experience and skills. Hire locally or remotely."
        },
        "everywhere": {
          "h1": "Job Seekers",
          "title": "Browse Resumes in Angola {'|'} Ambo Market",
          "description": "Employers – discover skilled candidates across Angola. Browse CVs or post your hiring needs today."
        }
      }
    },
    "services": {
      "construction": {
        "city": {
          "h1": "Construction Services in {city}",
          "title": "Hire Builders, Renovators and Contractors in {city} {'|'} Ambo Market",
          "description": "Find local professionals for construction, renovation, painting, plumbing, and more. Browse offers or post your service ad in {city}."
        },
        "everywhere": {
          "h1": "Construction Services",
          "title": "Hire Builders, Renovators and Contractors in Angola {'|'} Ambo Market",
          "description": "Connect with reliable construction professionals. Post or explore listings for renovation, repair and building services across Angola."
        }
      },
      "it-dev": {
        "city": {
          "h1": "IT and Development Services in {city}",
          "title": "Hire Developers, Designers and Tech Experts in {city} {'|'} Ambo Market",
          "description": "Browse ads for website development, app creation, tech support and design services. Post or find skilled IT professionals in {city}."
        },
        "everywhere": {
          "h1": "IT and Development Services",
          "title": "Hire Developers, Designers and Tech Experts in Angola {'|'} Ambo Market",
          "description": "Discover IT specialists for web, mobile and software projects across Angola. Post or hire tech services today."
        }
      },
      "education": {
        "city": {
          "h1": "Education and Tutoring in {city}",
          "title": "Find Tutors, Courses and Language Classes in {city} {'|'} Ambo Market",
          "description": "Explore offers for private tutoring, online courses, test prep, and more. Post or find education services in {city}."
        },
        "everywhere": {
          "h1": "Education and Tutoring",
          "title": "Find Tutors, Courses and Language Classes in Angola {'|'} Ambo Market",
          "description": "Hire or offer tutoring and educational services across Angola. Find classes or post your ad for free."
        }
      },
      "beauty": {
        "city": {
          "h1": "Beauty and Wellness Services in {city}",
          "title": "Find Salons, Massage and Cosmetic Services in {city} {'|'} Ambo Market",
          "description": "Book haircuts, manicures, skincare or spa sessions near you. Browse or offer beauty services in {city}."
        },
        "everywhere": {
          "h1": "Beauty and Wellness Services",
          "title": "Find Salons, Massage and Cosmetic Services in Angola {'|'} Ambo Market",
          "description": "Browse listings for beauty and wellness – from hairstylists to spa treatments. Offer or hire across Angola."
        }
      },
      "other-services": {
        "city": {
          "h1": "Other Services in {city}",
          "title": "Hire or Offer Services in {city} {'|'} Ambo Market",
          "description": "Explore a variety of services: delivery, event planning, logistics and more. Post or browse service ads in {city}."
        },
        "everywhere": {
          "h1": "Other Services",
          "title": "Hire or Offer Services in Angola {'|'} Ambo Market",
          "description": "Discover a range of local and remote services across Angola. From errands to consulting – find what you need or post your ad."
        }
      }
    },
    "animals": {
      "pets": {
        "city": {
          "h1": "Pets for Sale in {city}",
          "title": "Buy or Adopt Dogs, Cats and More in {city} {'|'} Ambo Market",
          "description": "Find puppies, kittens and other pets in {city}. Post or explore listings for adoption or sale from individuals and breeders."
        },
        "everywhere": {
          "h1": "Pets for Sale",
          "title": "Buy or Adopt Dogs, Cats and More in Angola {'|'} Ambo Market",
          "description": "Discover pets for sale or adoption across Angola. Dogs, cats, rabbits and more – browse listings or post your own."
        }
      },
      "other-animals": {
        "city": {
          "h1": "Livestock and Exotic Animals in {city}",
          "title": "Buy or Sell Birds, Fish and Livestock in {city} {'|'} Ambo Market",
          "description": "Explore offers for chickens, goats, parrots, fish and more. Post or find listings for various animals in {city}."
        },
        "everywhere": {
          "h1": "Livestock and Exotic Animals",
          "title": "Buy or Sell Birds, Fish and Livestock in Angola {'|'} Ambo Market",
          "description": "From poultry to aquarium fish, browse a wide range of animals across Angola. Post your animal ad or find trusted sellers."
        }
      },
      "supplies": {
        "city": {
          "h1": "Animal Supplies in {city}",
          "title": "Buy Pet Food, Cages, and Accessories in {city} {'|'} Ambo Market",
          "description": "Get deals on pet food, grooming tools, cages, aquariums, leashes and more in {city}. Post or browse pet supply ads."
        },
        "everywhere": {
          "h1": "Animal Supplies",
          "title": "Buy Pet Food, Cages, and Accessories in Angola {'|'} Ambo Market",
          "description": "Find animal supplies for sale across Angola. Food, grooming gear, and pet accessories – all in one place."
        }
      }
    },
    "hobby": {
      "sport": {
        "city": {
          "h1": "Sports Equipment in {city}",
          "title": "Buy and Sell Sports Gear in {city} {'|'} Ambo Market",
          "description": "Find fitness gear, bicycles, gym equipment, and more. Buy or sell sports items in {city} quickly and easily."
        },
        "everywhere": {
          "h1": "Sports Equipment",
          "title": "Buy and Sell Sports Gear in Angola {'|'} Ambo Market",
          "description": "Explore listings for sports and fitness items across Angola. Post your ad or find great deals on gear today."
        }
      },
      "music": {
        "city": {
          "h1": "Musical Instruments in {city}",
          "title": "Buy and Sell Guitars, Keyboards, Drums and More in {city} {'|'} Ambo Market",
          "description": "Browse listings for new and used instruments. Sell or find guitars, keyboards, and music gear in {city}."
        },
        "everywhere": {
          "h1": "Musical Instruments",
          "title": "Buy and Sell Guitars, Keyboards, Drums and More in Angola {'|'} Ambo Market",
          "description": "Discover musical instruments for beginners and pros. Post your ad or shop across Angola today."
        }
      },
      "games": {
        "city": {
          "h1": "Games and Consoles in {city}",
          "title": "Buy and Sell Consoles, Board Games and Accessories in {city} {'|'} Ambo Market",
          "description": "Find gaming gear including PlayStation, Xbox, Nintendo, board games, and more. Post your ad in {city}."
        },
        "everywhere": {
          "h1": "Games and Consoles",
          "title": "Buy and Sell Consoles, Board Games and Accessories in Angola {'|'} Ambo Market",
          "description": "Shop gaming consoles, board games and accessories across Angola. Post your ad or browse offers now."
        }
      },
      "collectibles": {
        "city": {
          "h1": "Collectibles and Antiques in {city}",
          "title": "Buy and Sell Stamps, Coins and Antiques in {city} {'|'} Ambo Market",
          "description": "Browse rare items and antiques – from vintage furniture to coins and art. Find unique pieces or post your own."
        },
        "everywhere": {
          "h1": "Collectibles and Antiques",
          "title": "Buy and Sell Stamps, Coins and Antiques in Angola {'|'} Ambo Market",
          "description": "Explore antique and collectible listings across Angola. Sell or find vintage treasures easily."
        }
      },
      "other-hobby": {
        "city": {
          "h1": "Other Hobby Items in {city}",
          "title": "Buy and Sell Hobby Goods in {city} {'|'} Ambo Market",
          "description": "Post or browse listings for crafts, models, puzzles and other hobby gear in {city}."
        },
        "everywhere": {
          "h1": "Other Hobby Items",
          "title": "Buy and Sell Hobby Goods in Angola {'|'} Ambo Market",
          "description": "Find supplies and equipment for hobbies and creative activities. Post or explore listings across Angola."
        }
      }
    },
    "kids": {
      "clothes": {
        "city": {
          "h1": "Children’s Clothing in {city}",
          "title": "Buy and Sell Kids’ Clothes in {city} {'|'} Ambo Market",
          "description": "Browse new and second-hand clothes for boys and girls. Jackets, shirts, pants, and more available in {city}."
        },
        "everywhere": {
          "h1": "Children’s Clothing",
          "title": "Buy and Sell Kids’ Clothes in Angola {'|'} Ambo Market",
          "description": "Explore kids' clothing across Angola – from everyday wear to special outfits. Post or browse offers today."
        }
      },
      "toys": {
        "city": {
          "h1": "Toys and Games in {city}",
          "title": "Buy and Sell Kids’ Toys in {city} {'|'} Ambo Market",
          "description": "Shop for dolls, puzzles, cars, educational toys and more in {city}. Find fun for every age group."
        },
        "everywhere": {
          "h1": "Toys and Games",
          "title": "Buy and Sell Kids’ Toys in Angola {'|'} Ambo Market",
          "description": "Discover toys for all ages – educational, interactive and classic options. Post or browse listings easily."
        }
      },
      "furniture": {
        "city": {
          "h1": "Children’s Furniture in {city}",
          "title": "Buy Cribs, Beds and Kids’ Furniture in {city} {'|'} Ambo Market",
          "description": "Find kids’ beds, tables, high chairs, and more. Post your furniture ad or browse listings in {city}."
        },
        "everywhere": {
          "h1": "Children’s Furniture",
          "title": "Buy Cribs, Beds and Kids’ Furniture in Angola {'|'} Ambo Market",
          "description": "Explore furniture for nurseries and children’s rooms. Post or shop across Angola today."
        }
      },
      "other-kids": {
        "city": {
          "h1": "Other Children’s Items in {city}",
          "title": "Buy and Sell Kids’ Essentials in {city} {'|'} Ambo Market",
          "description": "From strollers to school supplies – browse various children’s products in {city}. Post your listing for free."
        },
        "everywhere": {
          "h1": "Other Children’s Items",
          "title": "Buy and Sell Kids’ Essentials in Angola {'|'} Ambo Market",
          "description": "Explore listings for kids' accessories, strollers, and more. Find or post offers across Angola."
        }
      }
    },
    "home": {
      "furniture": {
        "city": {
          "h1": "Furniture for Sale in {city}",
          "title": "Buy and Sell Home Furniture in {city} {'|'} Ambo Market",
          "description": "Shop for sofas, tables, chairs, wardrobes and more. Find affordable furniture deals in {city} or post your ad for free."
        },
        "everywhere": {
          "h1": "Furniture for Sale",
          "title": "Buy and Sell Home Furniture in Angola {'|'} Ambo Market",
          "description": "Browse listings for new and used furniture across Angola. Sell or buy beds, shelves, and more easily."
        }
      },
      "appliances": {
        "city": {
          "h1": "Home Appliances in {city}",
          "title": "Buy Fridges, Washers, Microwaves and More in {city} {'|'} Ambo Market",
          "description": "Explore listings for kitchen and household appliances. Buy or sell used or new items in {city}."
        },
        "everywhere": {
          "h1": "Home Appliances",
          "title": "Buy Fridges, Washers, Microwaves and More in Angola {'|'} Ambo Market",
          "description": "Find affordable appliances for your home. Sell or buy listings across Angola with ease."
        }
      },
      "tools": {
        "city": {
          "h1": "Tools and DIY Items in {city}",
          "title": "Buy and Sell Tools and Equipment in {city} {'|'} Ambo Market",
          "description": "Drills, hammers, ladders, and more. Post or browse tools for home improvement or repairs in {city}."
        },
        "everywhere": {
          "h1": "Tools and DIY Items",
          "title": "Buy and Sell Tools and Equipment in Angola {'|'} Ambo Market",
          "description": "Shop for tools for construction, repair, and home use. Post or explore offers across Angola."
        }
      },
      "decor": {
        "city": {
          "h1": "Home Décor in {city}",
          "title": "Buy Decorative Items and Interior Pieces in {city} {'|'} Ambo Market",
          "description": "Find lighting, curtains, rugs, wall art and more in {city}. Add style to your home – browse or post now."
        },
        "everywhere": {
          "h1": "Home Décor",
          "title": "Buy Decorative Items and Interior Pieces in Angola {'|'} Ambo Market",
          "description": "Browse stylish décor listings across Angola. Post your ad or find great additions for your home."
        }
      },
      "other-home": {
        "city": {
          "h1": "Other Home Goods in {city}",
          "title": "Buy and Sell Household Items in {city} {'|'} Ambo Market",
          "description": "From kitchen tools to storage boxes – find various home essentials in {city}. Post or browse listings easily."
        },
        "everywhere": {
          "h1": "Other Home Goods",
          "title": "Buy and Sell Household Items in Angola {'|'} Ambo Market",
          "description": "Shop for a wide range of home items. Explore listings or post your own across Angola."
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
    "vehicles": {
      "cars": {
        "city": {
          "h1": "Carros à Venda em {city}",
          "title": "Carros Novos e Usados em {city} {'|'} Compre e Venda {'|'} Ambo Market",
          "description": "Compre e venda carros em {city}. Veja ofertas de veículos novos e usados, compare preços e fale com vendedores de confiança. Anuncie o seu carro grátis!"
        },
        "everywhere": {
          "h1": "Carros à Venda",
          "title": "Carros Novos e Usados em Angola {'|'} Compre e Venda {'|'} Ambo Market",
          "description": "Descubra os melhores carros à venda em Angola. Novos e usados, com preços competitivos. Anuncie ou compre com segurança e rapidez."
        }
      },
      "motorcycles": {
        "city": {
          "h1": "Motas à Venda em {city}",
          "title": "Motas e Scooters em {city} {'|'} Compre e Venda {'|'} Ambo Market",
          "description": "Veja anúncios de motas, scooters e outros veículos de duas rodas em {city}. Conecte-se com vendedores verificados ou anuncie grátis."
        },
        "everywhere": {
          "h1": "Motas à Venda",
          "title": "Motas, Scooters e Motociclos em Angola {'|'} Ambo Market",
          "description": "Compre ou venda motas em Angola. Anúncios de scooters e outros veículos de duas rodas. Plataforma rápida, gratuita e segura."
        }
      },
      "commercial": {
        "city": {
          "h1": "Veículos Comerciais em {city}",
          "title": "Caminhões, Carrinhas e Comerciais em {city} {'|'} Ambo Market",
          "description": "Veja veículos comerciais à venda em {city}. Caminhões, carrinhas, furgões e mais. Publique seu anúncio ou compre de vendedores verificados."
        },
        "everywhere": {
          "h1": "Veículos Comerciais",
          "title": "Venda de Caminhões, Carrinhas e Comerciais em Angola {'|'} Ambo Market",
          "description": "Anúncios de veículos comerciais em Angola. Ideal para empresas e serviços. Compre ou venda caminhões, carrinhas e utilitários com segurança."
        }
      },
      "boats": {
        "city": {
          "h1": "Barcos e Embarcações em {city}",
          "title": "Venda de Barcos em {city} {'|'} Pesca, Lazer e Transporte {'|'} Ambo Market",
          "description": "Compre ou venda barcos em {city}. Pesca, lazer, lanchas e outros tipos de embarcação. Anuncie gratuitamente."
        },
        "everywhere": {
          "h1": "Barcos e Embarcações",
          "title": "Compra e Venda de Barcos em Angola {'|'} Ambo Market",
          "description": "Veja anúncios de barcos em Angola. Ideal para pesca, transporte ou lazer. Publique o seu anúncio de forma gratuita."
        }
      },
      "parts": {
        "city": {
          "h1": "Peças e Acessórios em {city}",
          "title": "Venda de Peças e Acessórios para Carros em {city} {'|'} Ambo Market",
          "description": "Encontre peças auto em {city}: pneus, baterias, faróis, espelhos e mais. Venda ou compre com facilidade e segurança."
        },
        "everywhere": {
          "h1": "Peças e Acessórios",
          "title": "Peças para Carros em Angola {'|'} Venda Rápida e Segura {'|'} Ambo Market",
          "description": "Procure peças e acessórios para carros em Angola. Anuncie gratuitamente ou compre com vendedores de confiança em poucos cliques."
        }
      }
    },
    "real-estate": {
      "rent": {
        "city": {
          "h1": "Imóveis para Aluguel em {city}",
          "title": "Casas e Apartamentos para Alugar em {city} {'|'} Ambo Market",
          "description": "Encontre casas, apartamentos e quartos para alugar em {city}. Opções acessíveis para estadias curtas ou longas. Anuncie seu imóvel gratuitamente."
        },
        "everywhere": {
          "h1": "Imóveis para Aluguel",
          "title": "Casas e Apartamentos para Alugar em Angola {'|'} Ambo Market",
          "description": "Veja anúncios de imóveis para alugar em toda Angola. Quartos, casas e apartamentos para todos os orçamentos. Alugue ou anuncie facilmente."
        }
      },
      "sale": {
        "city": {
          "h1": "Imóveis à Venda em {city}",
          "title": "Compre Casas e Terrenos em {city} {'|'} Ambo Market",
          "description": "Explore casas, apartamentos e terrenos à venda em {city}. Boas oportunidades com vendedores verificados. Anuncie seu imóvel gratuitamente."
        },
        "everywhere": {
          "h1": "Imóveis à Venda",
          "title": "Casas, Apartamentos e Terrenos à Venda em Angola {'|'} Ambo Market",
          "description": "Compre imóveis em toda Angola – casas, terrenos e apartamentos. Publique ou veja anúncios gratuitamente."
        }
      },
      "commercial": {
        "city": {
          "h1": "Imóveis Comerciais em {city}",
          "title": "Lojas, Escritórios e Armazéns em {city} {'|'} Ambo Market",
          "description": "Encontre espaços comerciais para venda ou aluguel em {city}. Lojas, escritórios, armazéns e muito mais. Anuncie seu imóvel comercial de graça."
        },
        "everywhere": {
          "h1": "Imóveis Comerciais",
          "title": "Lojas, Escritórios e Armazéns em Angola {'|'} Ambo Market",
          "description": "Explore espaços comerciais em Angola. Venda ou alugue lojas, escritórios e galpões. Publique seu anúncio gratuitamente."
        }
      },
      "land": {
        "city": {
          "h1": "Terrenos à Venda em {city}",
          "title": "Compre Lotes e Terrenos em {city} {'|'} Ambo Market",
          "description": "À procura de terrenos em {city}? Veja opções residenciais, comerciais e agrícolas. Anuncie seu terreno gratuitamente hoje mesmo."
        },
        "everywhere": {
          "h1": "Terrenos à Venda",
          "title": "Compre Lotes e Terrenos em Angola {'|'} Ambo Market",
          "description": "Encontre terrenos à venda em toda Angola. Ideal para construção, agricultura ou investimento. Publique seu anúncio com facilidade."
        }
      }
    },
    "electronics": {
      "phones": {
        "city": {
          "h1": "Telemóveis à Venda em {city}",
          "title": "Smartphones Novos e Usados em {city} {'|'} Compre e Venda {'|'} Ambo Market",
          "description": "Encontre ofertas de telemóveis em {city}. iPhones, Androids e muito mais. Compre com segurança ou anuncie o seu gratuitamente."
        },
        "everywhere": {
          "h1": "Telemóveis à Venda",
          "title": "Smartphones Novos e Usados em Angola {'|'} Compre e Venda {'|'} Ambo Market",
          "description": "Compre e venda smartphones em Angola. Veja ofertas de iPhone, Samsung, Xiaomi e outros. Publique o seu anúncio grátis."
        }
      },
      "computers": {
        "city": {
          "h1": "Computadores e Portáteis em {city}",
          "title": "Laptops, PCs e Acessórios em {city} {'|'} Ambo Market",
          "description": "Compre e venda portáteis, computadores e acessórios em {city}. Marcas populares, preços acessíveis. Anuncie grátis!"
        },
        "everywhere": {
          "h1": "Computadores e Portáteis",
          "title": "Laptops, PCs e Acessórios em Angola {'|'} Ambo Market",
          "description": "Encontre computadores novos e usados em Angola. Monitores, teclados, impressoras e muito mais. Publique o seu anúncio gratuitamente."
        }
      },
      "gaming": {
        "city": {
          "h1": "Equipamentos de Jogos em {city}",
          "title": "Consolas, Jogos e Acessórios em {city} {'|'} Ambo Market",
          "description": "Descubra consolas, jogos e acessórios em {city}. PS5, Xbox, Nintendo Switch e mais. Anuncie ou compre hoje mesmo!"
        },
        "everywhere": {
          "h1": "Equipamentos de Jogos",
          "title": "Venda de Consolas, Jogos e Acessórios em Angola {'|'} Ambo Market",
          "description": "Ofertas em consolas e videojogos em Angola. Encontre PS5, Xbox, Nintendo e jogos populares. Publique seu anúncio grátis."
        }
      },
      "tv-audio-photo": {
        "city": {
          "h1": "TV, Áudio e Fotografia em {city}",
          "title": "Televisores, Colunas e Câmaras em {city} {'|'} Ambo Market",
          "description": "Compre ou venda equipamentos de som, imagem e vídeo em {city}. TVs, colunas, câmaras e muito mais. Anuncie grátis."
        },
        "everywhere": {
          "h1": "TV, Áudio e Fotografia",
          "title": "Venda de TVs, Colunas e Câmaras em Angola {'|'} Ambo Market",
          "description": "Explore eletrônicos em Angola: TVs, som e fotografia. Ofertas novas e usadas com vendedores de confiança."
        }
      },
      "appliances": {
        "city": {
          "h1": "Eletrodomésticos em {city}",
          "title": "Frigoríficos, Máquinas e Fornos em {city} {'|'} Ambo Market",
          "description": "Compre ou venda eletrodomésticos em {city}. Equipamentos de cozinha e lavandaria novos ou usados. Anuncie de graça!"
        },
        "everywhere": {
          "h1": "Eletrodomésticos",
          "title": "Venda de Frigoríficos, Máquinas e Fornos em Angola {'|'} Ambo Market",
          "description": "Veja eletrodomésticos em Angola: frigoríficos, fogões, micro-ondas, máquinas de lavar e mais. Publique seu anúncio grátis."
        }
      },
      "accessories-electronics": {
        "city": {
          "h1": "Acessórios Eletrônicos em {city}",
          "title": "Cabos, Carregadores e Gadgets em {city} {'|'} Ambo Market",
          "description": "Veja acessórios eletrônicos em {city}: carregadores, capas, fones, comandos e mais. Compre ou anuncie facilmente."
        },
        "everywhere": {
          "h1": "Acessórios Eletrônicos",
          "title": "Venda de Acessórios Eletrônicos em Angola {'|'} Ambo Market",
          "description": "Ofertas de acessórios para telemóveis, PCs e TVs em Angola. Gadgets úteis para casa ou trabalho. Publique o seu anúncio grátis."
        }
      }
    },
    "fashion": {
      "men": {
        "city": {
          "h1": "Moda Masculina em {city}",
          "title": "Roupas e Acessórios Masculinos em {city} {'|'} Compre e Venda {'|'} Ambo Market",
          "description": "Compre casacos, camisas, calças, sapatos e acessórios masculinos em {city}. Moda acessível e estilosa. Anuncie gratuitamente!"
        },
        "everywhere": {
          "h1": "Moda Masculina",
          "title": "Roupas e Acessórios Masculinos em Angola {'|'} Ambo Market",
          "description": "Descubra moda masculina em Angola. Anuncie ou compre roupas e acessórios com facilidade e segurança."
        }
      },
      "women": {
        "city": {
          "h1": "Moda Feminina em {city}",
          "title": "Vestidos, Acessórios e Roupas Femininas em {city} {'|'} Ambo Market",
          "description": "Explore moda feminina em {city}. Vestidos, carteiras, blusas, calçados e mais. Compre ou anuncie grátis!"
        },
        "everywhere": {
          "h1": "Moda Feminina",
          "title": "Roupas e Acessórios Femininos em Angola {'|'} Compre e Venda {'|'} Ambo Market",
          "description": "Moda feminina disponível em toda Angola. Anuncie ou compre roupas, bolsas, sapatos e acessórios com facilidade."
        }
      },
      "shoes": {
        "city": {
          "h1": "Sapatos à Venda em {city}",
          "title": "Sapatos Masculinos e Femininos em {city} {'|'} Ambo Market",
          "description": "Encontre sapatos estilosos em {city}. Ténis, botas, sandálias e mais – novos ou usados. Anuncie seu par gratuitamente."
        },
        "everywhere": {
          "h1": "Sapatos à Venda",
          "title": "Sapatos para Homem e Mulher em Angola {'|'} Compre e Venda {'|'} Ambo Market",
          "description": "Explore diversos modelos de sapatos em Angola. Calçado para todas as ocasiões. Anuncie ou compre com segurança."
        }
      },
      "bags": {
        "city": {
          "h1": "Mochilas e Malas em {city}",
          "title": "Malas de Mão, Mochilas e de Viagem em {city} {'|'} Ambo Market",
          "description": "Veja malas femininas, mochilas escolares e malas de viagem em {city}. Compre ou publique anúncios de forma fácil e grátis."
        },
        "everywhere": {
          "h1": "Mochilas e Malas",
          "title": "Malas de Mão, Mochilas e de Viagem em Angola {'|'} Ambo Market",
          "description": "Descubra malas para uso diário, trabalho ou viagem em Angola. Publique ou veja ofertas com um clique."
        }
      },
      "accessories-fashion": {
        "city": {
          "h1": "Acessórios de Moda em {city}",
          "title": "Relógios, Óculos e Bijuterias em {city} {'|'} Ambo Market",
          "description": "Complete o seu visual com acessórios de moda em {city}. Chapéus, cintos, colares, óculos e mais. Compre ou anuncie grátis."
        },
        "everywhere": {
          "h1": "Acessórios de Moda",
          "title": "Relógios, Bijuterias e Óculos em Angola {'|'} Ambo Market",
          "description": "Acessórios para complementar qualquer look. Compre ou venda relógios, colares, pulseiras e muito mais em Angola."
        }
      },
      "beauty-products": {
        "city": {
          "h1": "Produtos de Beleza em {city}",
          "title": "Perfumes, Maquilhagem e Cosméticos em {city} {'|'} Ambo Market",
          "description": "Veja produtos de beleza em {city}. Perfumes, cremes, maquilhagem, itens para cabelo e muito mais. Anuncie ou compre facilmente."
        },
        "everywhere": {
          "h1": "Produtos de Beleza",
          "title": "Cosméticos, Perfumes e Cuidados Pessoais em Angola {'|'} Ambo Market",
          "description": "Compre e venda produtos de beleza em Angola. Maquilhagem, cuidados com a pele e perfumes. Tudo num só lugar."
        }
      }
    },
    "jobs": {
      "vacancies": {
        "city": {
          "h1": "Ofertas de Emprego em {city}",
          "title": "Candidate-se a Vagas de Emprego em {city} {'|'} Ambo Market",
          "description": "Veja vagas de trabalho publicadas por empresas em {city}. Trabalhos a tempo inteiro, parcial, freelance ou remoto. Candidate-se ou publique uma vaga gratuitamente."
        },
        "everywhere": {
          "h1": "Ofertas de Emprego",
          "title": "Candidate-se a Vagas de Emprego em Angola {'|'} Ambo Market",
          "description": "Explore anúncios de emprego em toda Angola. Encontre novas oportunidades ou publique uma vaga de graça."
        }
      },
      "resumes": {
        "city": {
          "h1": "Candidatos à Procura de Emprego em {city}",
          "title": "Veja Currículos em {city} {'|'} Ambo Market",
          "description": "Encontre profissionais à procura de trabalho em {city}. Filtre por setor, experiência ou habilidades. Contrate localmente ou remotamente."
        },
        "everywhere": {
          "h1": "Candidatos à Procura de Emprego",
          "title": "Veja Currículos em Angola {'|'} Ambo Market",
          "description": "Empregadores – descubram candidatos qualificados em Angola. Veja currículos ou publique as suas vagas hoje mesmo."
        }
      }
    },
    "services": {
      "construction": {
        "city": {
          "h1": "Serviços de Construção em {city}",
          "title": "Contrate Pedreiros, Pintores e Técnicos em {city} {'|'} Ambo Market",
          "description": "Encontre profissionais para construção, reformas, pintura, canalização e mais em {city}. Publique ou responda a anúncios gratuitamente."
        },
        "everywhere": {
          "h1": "Serviços de Construção",
          "title": "Contrate Pedreiros, Pintores e Técnicos em Angola {'|'} Ambo Market",
          "description": "Conecte-se com profissionais de construção em toda Angola. Publique ou explore anúncios para obras, reparações e serviços técnicos."
        }
      },
      "it-dev": {
        "city": {
          "h1": "Serviços de TI e Desenvolvimento em {city}",
          "title": "Contrate Programadores, Designers e Técnicos em {city} {'|'} Ambo Market",
          "description": "Anúncios de desenvolvimento web, criação de apps, suporte técnico e design em {city}. Publique ou contrate profissionais de TI."
        },
        "everywhere": {
          "h1": "Serviços de TI e Desenvolvimento",
          "title": "Contrate Programadores, Designers e Técnicos em Angola {'|'} Ambo Market",
          "description": "Descubra especialistas em tecnologia em toda Angola. Criação de sites, aplicações, suporte e mais."
        }
      },
      "education": {
        "city": {
          "h1": "Educação e Aulas Particulares em {city}",
          "title": "Encontre Professores, Cursos e Aulas de Idiomas em {city} {'|'} Ambo Market",
          "description": "Veja ofertas de explicações, cursos online, preparação para exames e mais em {city}. Anuncie ou contrate serviços educacionais."
        },
        "everywhere": {
          "h1": "Educação e Aulas Particulares",
          "title": "Encontre Professores, Cursos e Aulas em Angola {'|'} Ambo Market",
          "description": "Ofereça ou contrate serviços de educação em toda Angola. Aulas presenciais ou online disponíveis."
        }
      },
      "beauty": {
        "city": {
          "h1": "Serviços de Beleza e Bem-Estar em {city}",
          "title": "Salões, Massagens e Estética em {city} {'|'} Ambo Market",
          "description": "Marque corte de cabelo, manicure, massagens e tratamentos em {city}. Anuncie ou encontre serviços de beleza facilmente."
        },
        "everywhere": {
          "h1": "Serviços de Beleza e Bem-Estar",
          "title": "Salões, Massagens e Estética em Angola {'|'} Ambo Market",
          "description": "Veja anúncios de beleza e bem-estar – cabeleireiros, spas, estética e mais. Ofereça ou contrate serviços em Angola."
        }
      },
      "other-services": {
        "city": {
          "h1": "Outros Serviços em {city}",
          "title": "Contrate ou Ofereça Serviços em {city} {'|'} Ambo Market",
          "description": "Planeamento de eventos, entregas, logística e muito mais. Anuncie ou procure serviços variados em {city}."
        },
        "everywhere": {
          "h1": "Outros Serviços",
          "title": "Contrate ou Ofereça Serviços em Angola {'|'} Ambo Market",
          "description": "Descubra serviços locais e remotos em Angola. Desde recados a consultorias – publique ou encontre o que precisa."
        }
      }
    },
    "animals": {
      "pets": {
        "city": {
          "h1": "Animais de Estimação à Venda em {city}",
          "title": "Compre ou Adote Cães, Gatos e Mais em {city} {'|'} Ambo Market",
          "description": "Encontre cachorros, gatos e outros animais de estimação em {city}. Anuncie ou explore ofertas de adoção e venda de criadores ou particulares."
        },
        "everywhere": {
          "h1": "Animais de Estimação à Venda",
          "title": "Compre ou Adote Cães, Gatos e Mais em Angola {'|'} Ambo Market",
          "description": "Descubra animais para venda ou adoção em toda Angola. Cães, gatos, coelhos e mais – veja anúncios ou publique o seu."
        }
      },
      "other-animals": {
        "city": {
          "h1": "Gado e Animais Exóticos em {city}",
          "title": "Compre ou Venda Aves, Peixes e Gado em {city} {'|'} Ambo Market",
          "description": "Veja ofertas de galinhas, cabras, papagaios, peixes e mais em {city}. Anuncie ou encontre animais variados com facilidade."
        },
        "everywhere": {
          "h1": "Gado e Animais Exóticos",
          "title": "Compre ou Venda Aves, Peixes e Gado em Angola {'|'} Ambo Market",
          "description": "De aves a peixes ornamentais – encontre todo tipo de animal em Angola. Anuncie ou compre com confiança."
        }
      },
      "supplies": {
        "city": {
          "h1": "Produtos para Animais em {city}",
          "title": "Compre Rações, Gaiolas e Acessórios em {city} {'|'} Ambo Market",
          "description": "Ofertas de ração, utensílios de higiene, aquários, trelas e mais em {city}. Publique ou explore anúncios de produtos para animais."
        },
        "everywhere": {
          "h1": "Produtos para Animais",
          "title": "Compre Rações, Gaiolas e Acessórios em Angola {'|'} Ambo Market",
          "description": "Encontre produtos para animais em toda Angola. Alimentos, acessórios e equipamentos – tudo num só lugar."
        }
      }
    },
    "hobby": {
      "sport": {
        "city": {
          "h1": "Equipamentos Desportivos em {city}",
          "title": "Compre e Venda Artigos de Desporto em {city} {'|'} Ambo Market",
          "description": "Encontre equipamentos de ginásio, bicicletas, pesos, bolas e mais. Compre ou venda artigos desportivos em {city} facilmente."
        },
        "everywhere": {
          "h1": "Equipamentos Desportivos",
          "title": "Compre e Venda Artigos de Desporto em Angola {'|'} Ambo Market",
          "description": "Explore anúncios de artigos desportivos em toda Angola. Publique seu anúncio ou encontre boas ofertas hoje."
        }
      },
      "music": {
        "city": {
          "h1": "Instrumentos Musicais em {city}",
          "title": "Compre e Venda Guitarras, Teclados, Baterias e Mais em {city} {'|'} Ambo Market",
          "description": "Veja anúncios de instrumentos novos e usados. Encontre guitarras, teclados, tambores e mais em {city}. Anuncie gratuitamente."
        },
        "everywhere": {
          "h1": "Instrumentos Musicais",
          "title": "Compre e Venda Guitarras, Teclados, Baterias e Mais em Angola {'|'} Ambo Market",
          "description": "Instrumentos para iniciantes e profissionais. Publique ou explore anúncios em toda Angola hoje mesmo."
        }
      },
      "games": {
        "city": {
          "h1": "Jogos e Consolas em {city}",
          "title": "Compre e Venda Consolas, Jogos de Tabuleiro e Acessórios em {city} {'|'} Ambo Market",
          "description": "Ofertas de PlayStation, Xbox, Nintendo, jogos de tabuleiro e mais. Publique seu anúncio ou encontre ofertas em {city}."
        },
        "everywhere": {
          "h1": "Jogos e Consolas",
          "title": "Compre e Venda Consolas, Jogos de Tabuleiro e Acessórios em Angola {'|'} Ambo Market",
          "description": "Explore consolas, jogos e acessórios em toda Angola. Anuncie ou compre com facilidade."
        }
      },
      "collectibles": {
        "city": {
          "h1": "Colecionáveis e Antiguidades em {city}",
          "title": "Compre e Venda Selos, Moedas e Antiguidades em {city} {'|'} Ambo Market",
          "description": "Descubra peças raras – móveis antigos, arte, selos, moedas e mais em {city}. Publique ou explore anúncios únicos."
        },
        "everywhere": {
          "h1": "Colecionáveis e Antiguidades",
          "title": "Compre e Venda Selos, Moedas e Antiguidades em Angola {'|'} Ambo Market",
          "description": "Veja coleções vintage e antiguidades em toda Angola. Encontre ou publique tesouros especiais."
        }
      },
      "other-hobby": {
        "city": {
          "h1": "Outros Itens de Lazer em {city}",
          "title": "Compre e Venda Artigos de Lazer em {city} {'|'} Ambo Market",
          "description": "Anúncios de artesanato, puzzles, modelos e mais em {city}. Publique ou explore ofertas de passatempo."
        },
        "everywhere": {
          "h1": "Outros Itens de Lazer",
          "title": "Compre e Venda Artigos de Lazer em Angola {'|'} Ambo Market",
          "description": "Descubra produtos para hobbies e atividades criativas. Publique ou veja anúncios em Angola."
        }
      }
    },
    "kids": {
      "clothes": {
        "city": {
          "h1": "Roupas Infantis em {city}",
          "title": "Compre e Venda Roupas para Crianças em {city} {'|'} Ambo Market",
          "description": "Veja roupas novas e usadas para meninos e meninas em {city}. Casacos, camisas, calças e mais. Anuncie gratuitamente."
        },
        "everywhere": {
          "h1": "Roupas Infantis",
          "title": "Compre e Venda Roupas para Crianças em Angola {'|'} Ambo Market",
          "description": "Explore roupas infantis em toda Angola – para o dia a dia ou ocasiões especiais. Publique ou veja anúncios hoje mesmo."
        }
      },
      "toys": {
        "city": {
          "h1": "Brinquedos e Jogos em {city}",
          "title": "Compre e Venda Brinquedos para Crianças em {city} {'|'} Ambo Market",
          "description": "Encontre bonecas, carrinhos, jogos educativos e muito mais em {city}. Diversão para todas as idades."
        },
        "everywhere": {
          "h1": "Brinquedos e Jogos",
          "title": "Compre e Venda Brinquedos para Crianças em Angola {'|'} Ambo Market",
          "description": "Descubra brinquedos para todas as idades – educativos, interativos e clássicos. Anuncie ou compre facilmente."
        }
      },
      "furniture": {
        "city": {
          "h1": "Mobiliário Infantil em {city}",
          "title": "Compre Berços, Camas e Móveis Infantis em {city} {'|'} Ambo Market",
          "description": "Encontre camas, cadeiras altas, mesas e muito mais para crianças em {city}. Anuncie ou veja ofertas de móveis infantis."
        },
        "everywhere": {
          "h1": "Mobiliário Infantil",
          "title": "Compre Berços, Camas e Móveis Infantis em Angola {'|'} Ambo Market",
          "description": "Explore móveis para quartos de bebés e crianças. Anuncie ou compre em todo o país com facilidade."
        }
      },
      "other-kids": {
        "city": {
          "h1": "Outros Itens Infantis em {city}",
          "title": "Compre e Venda Produtos para Crianças em {city} {'|'} Ambo Market",
          "description": "Carrinhos de bebé, mochilas escolares, cadeirinhas e muito mais em {city}. Veja ou publique o seu anúncio gratuitamente."
        },
        "everywhere": {
          "h1": "Outros Itens Infantis",
          "title": "Compre e Venda Produtos para Crianças em Angola {'|'} Ambo Market",
          "description": "Veja produtos variados para bebés e crianças – acessórios, transporte, escola e mais. Anuncie ou encontre o que precisa."
        }
      }
    },
    "home": {
      "furniture": {
        "city": {
          "h1": "Móveis à Venda em {city}",
          "title": "Compre e Venda Mobiliário para Casa em {city} {'|'} Ambo Market",
          "description": "Sofás, mesas, cadeiras, roupeiros e muito mais. Encontre boas ofertas em {city} ou publique seu anúncio gratuitamente."
        },
        "everywhere": {
          "h1": "Móveis à Venda",
          "title": "Compre e Venda Mobiliário para Casa em Angola {'|'} Ambo Market",
          "description": "Veja anúncios de móveis novos e usados em toda Angola. Camas, prateleiras e muito mais. Publique ou compre com facilidade."
        }
      },
      "appliances": {
        "city": {
          "h1": "Eletrodomésticos para Casa em {city}",
          "title": "Compre Frigoríficos, Máquinas, Micro-ondas e Mais em {city} {'|'} Ambo Market",
          "description": "Veja anúncios de eletrodomésticos para cozinha e casa em {city}. Compre novos ou usados. Anuncie gratuitamente."
        },
        "everywhere": {
          "h1": "Eletrodomésticos para Casa",
          "title": "Compre Frigoríficos, Máquinas, Micro-ondas e Mais em Angola {'|'} Ambo Market",
          "description": "Eletrodomésticos acessíveis em toda Angola. Publique ou veja anúncios de forma fácil."
        }
      },
      "tools": {
        "city": {
          "h1": "Ferramentas e Itens de Bricolagem em {city}",
          "title": "Compre e Venda Ferramentas e Equipamentos em {city} {'|'} Ambo Market",
          "description": "Berbequins, martelos, escadas e mais. Publique ou explore ferramentas para obras e reparos em {city}."
        },
        "everywhere": {
          "h1": "Ferramentas e Itens de Bricolagem",
          "title": "Compre e Venda Ferramentas e Equipamentos em Angola {'|'} Ambo Market",
          "description": "Ferramentas para construção, reparos e uso doméstico. Veja anúncios ou publique os seus em Angola."
        }
      },
      "decor": {
        "city": {
          "h1": "Decoração para Casa em {city}",
          "title": "Compre Itens Decorativos e de Interior em {city} {'|'} Ambo Market",
          "description": "Candeeiros, cortinas, tapetes, quadros e mais em {city}. Dê estilo à sua casa – veja ou publique anúncios agora."
        },
        "everywhere": {
          "h1": "Decoração para Casa",
          "title": "Compre Itens Decorativos e de Interior em Angola {'|'} Ambo Market",
          "description": "Veja artigos decorativos em toda Angola. Publique anúncios ou encontre o que falta na sua casa."
        }
      },
      "other-home": {
        "city": {
          "h1": "Outros Itens para Casa em {city}",
          "title": "Compre e Venda Artigos Domésticos em {city} {'|'} Ambo Market",
          "description": "Utensílios de cozinha, caixas de armazenamento e outros itens essenciais para casa em {city}. Anuncie ou explore ofertas."
        },
        "everywhere": {
          "h1": "Outros Itens para Casa",
          "title": "Compre e Venda Artigos Domésticos em Angola {'|'} Ambo Market",
          "description": "Veja uma variedade de itens para o lar em Angola. Publique o seu anúncio ou encontre o que precisa."
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

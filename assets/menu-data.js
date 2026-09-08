const BOBNBUNS_DATA = {
  restaurant: {
    name: "BOB 'N' BUNS",
    tagline: "Where Flavor Meets Fun",
    dietary: "100% Pure Veg",
    phone: "+91 9619242499",
    whatsapp: "+91 9619123404",
    address: "Shop No. 3, Block No-80, Parvat Gam Road, Behind Capital Squar, Surat - 395012",
    googleReviewUrl: "https://share.google/Tr1mjQjTwQxDnojWD",
    pdfMenuUrl: "bobnbuns-menu.pdf",
    swiggyUrl: "https://www.swiggy.com",
    zomatoUrl: "https://www.zomato.com"
  },
  categories: [
    { id: "meals", name: "Value Meals & Combos", icon: "🥤", description: "Complete meal combos served with medium fries & chilled Thums Up" },
    { id: "burgers", name: "Burger's", icon: "🍔", description: "Juicy, freshly grilled pure veg patties with signature sauces and soft buns" },
    { id: "wraps", name: "Wraps", icon: "🌯", description: "Flavour-packed rolled wraps with crunchy veggies, paneer, and tasty sauces" },
    { id: "snackers", name: "Snackers & Fries", icon: "🍟", description: "Crispy golden french fries in Medium & Large sizes, plus cheesy nuggets" },
    { id: "pizza", name: "Pizza", icon: "🍕", description: "Fresh dough baked to perfection with gooey melted cheese and gourmet toppings" },
    { id: "dips", name: "Dips & Add-ons", icon: "🥫", description: "Elevate your meal with our signature artisanal dips and extra cheese" }
  ],
  items: [
    // Meals (Page 1)
    {
      id: "meal-1",
      category: "meals",
      name: "Veg Extra Value Meal",
      price: 390,
      description: "01 Aloo Tikki Burger + 01 Tandoori Cheese Burger + 01 Masala Burger + 02 Medium Fries + 02 Thums Up (250 ml)",
      tag: "Best Value",
      badge: "Combo for 2-3"
    },
    {
      id: "meal-2",
      category: "meals",
      name: "Veg Masala Wrap Meal Saver",
      price: 250,
      description: "01 Masala Wrap + 01 Veg Aloo Tikki Burger + 01 Medium Fries + 01 Thums Up (250 ml)",
      tag: "Popular",
      badge: "Combo Meal"
    },
    {
      id: "meal-3",
      category: "meals",
      name: "Veg Spicy Meal Combo",
      price: 250,
      description: "01 Veg Peri Peri Burger + 01 Spicy Peri Peri Wrap + 01 Medium Fries + 01 Thums Up (250 ml)",
      tag: "Spicy",
      badge: "Combo Meal"
    },
    {
      id: "meal-4",
      category: "meals",
      name: "Veg Nuggets Meal Combo",
      price: 280,
      description: "01 Cheese Burger + Nuggets (9 Pcs) + 01 Medium Fries + 01 Thums Up (250 ml)",
      tag: "Kids Favorite",
      badge: "Combo Meal"
    },
    {
      id: "meal-5",
      category: "meals",
      name: "Veg Pizza Burger Meal Saver",
      price: 350,
      description: "01 Pizza Burger + 01 Paneer Tikka Wrap + 01 Medium Fries + 01 Thums Up (250 ml)",
      tag: "Chef Special",
      badge: "Combo Meal"
    },
    {
      id: "meal-6",
      category: "meals",
      name: "Mr BNB: Aloo Tikki Burger",
      price: 80,
      description: "Our signature crispy potato patty burger with freshly sliced veggies and tangy secret sauces",
      tag: "Budget Star",
      badge: "Single Item"
    },

    // Burgers (Page 2)
    {
      id: "burger-1",
      category: "burgers",
      name: "Veg Mexican Burger",
      price: 90,
      description: "Crunchy veg patty infused with Mexican salsa herbs, zesty mayo, and crisp lettuce"
    },
    {
      id: "burger-2",
      category: "burgers",
      name: "Veg Masala Burger",
      price: 90,
      description: "Desi spiced vegetable patty packed with aromatic Indian spices and tangy chutney mayo"
    },
    {
      id: "burger-3",
      category: "burgers",
      name: "Veg Signature Classic Burger",
      price: 90,
      description: "The timeless classic burger crafted with golden crisp patty, fresh tomato, onion & house sauce"
    },
    {
      id: "burger-4",
      category: "burgers",
      name: "Veg Tandoori Tikka Burger",
      price: 100,
      description: "Smoky tandoori marinated patty layered with sliced red onions and tandoori spread"
    },
    {
      id: "burger-5",
      category: "burgers",
      name: "Veg Cheese Burger",
      price: 100,
      description: "Crisp seasoned veg patty crowned with melted cheddar cheese slice and rich burger mayo"
    },
    {
      id: "burger-6",
      category: "burgers",
      name: "Veg Tandoori Cheese Burger",
      price: 110,
      description: "Smoky spiced tandoori patty paired with melted cheese slice and savory tandoori sauce"
    },
    {
      id: "burger-7",
      category: "burgers",
      name: "BNB Paneer Burger",
      price: 130,
      description: "Premium marinated cottage cheese patty cooked to golden perfection with crisp lettuce and sauces"
    },
    {
      id: "burger-8",
      category: "burgers",
      name: "BNB Paneer Cheese Burger",
      price: 130,
      description: "Succulent paneer patty smothered with melted cheese slice, special BNB spices and herb mayo"
    },
    {
      id: "burger-9",
      category: "burgers",
      name: "BNB Veg Pizza Burger",
      price: 150,
      description: "The ultimate fusion burger filled with pizza sauce, melted mozzarella, capsicum, corn & oregano"
    },
    {
      id: "burger-10",
      category: "burgers",
      name: "BNB Veg Jack And Jill Burger",
      price: 110,
      description: "Double the fun with special dual-flavored secret sauces, crispy patty and crunchy greens"
    },
    {
      id: "burger-11",
      category: "burgers",
      name: "BNB Veg Barbeque Burger",
      price: 110,
      description: "Sweet, smoky, and bold BBQ sauce glaze drizzled over a tender grilled veggie patty"
    },

    // Wraps (Page 2)
    {
      id: "wrap-1",
      category: "wraps",
      name: "Veg Mayo Wrap",
      price: 70,
      description: "Soft warm tortilla rolled with crispy veg filling and smooth creamy mayonnaise"
    },
    {
      id: "wrap-2",
      category: "wraps",
      name: "Veg Schezwan Wrap",
      price: 70,
      description: "Spicy Schezwan wok-tossed vegetable mix with fiery red chili garlic sauce"
    },
    {
      id: "wrap-3",
      category: "wraps",
      name: "Veg Barbeque Wrap",
      price: 70,
      description: "Smoky BBQ flavored roasted veggies wrapped tightly in a freshly toasted flatbread"
    },
    {
      id: "wrap-4",
      category: "wraps",
      name: "Veg Masala Wrap",
      price: 90,
      description: "Rich Indian chatpata masala filling rolled with crisp diced onions and green peppers"
    },
    {
      id: "wrap-5",
      category: "wraps",
      name: "Veg Mexican Wrap",
      price: 90,
      description: "Zesty Mexican seasoned filling with jalapeños, sweet corn, salsa, and herb sauce"
    },
    {
      id: "wrap-6",
      category: "wraps",
      name: "Veg Signature Classic Wrap",
      price: 90,
      description: "Our signature blend of crispy patties, fresh farm lettuce, sliced onions & house dressing"
    },
    {
      id: "wrap-7",
      category: "wraps",
      name: "Veg Tandoori Tikka Wrap",
      price: 90,
      description: "Clay-oven style tandoori spiced filling with crunchy onions and mint-tandoori dressing"
    },
    {
      id: "wrap-8",
      category: "wraps",
      name: "Veg Cheese Tandoori Wrap",
      price: 110,
      description: "Smoky tandoori spices generously loaded with creamy melted cheese"
    },
    {
      id: "wrap-9",
      category: "wraps",
      name: "Veg Double Cheese Wrap",
      price: 110,
      description: "Loaded with a double layer of liquid cheese and melted cheese slice for true cheese lovers"
    },
    {
      id: "wrap-10",
      category: "wraps",
      name: "Veg Chilly Cheese Wrap",
      price: 110,
      description: "Spicy green chili kick combined with creamy melted cheese and crisp veggies"
    },
    {
      id: "wrap-11",
      category: "wraps",
      name: "BNB Paneer Wrap",
      price: 130,
      description: "Tender cubes of fresh cottage cheese tossed in special herbs and spices"
    },
    {
      id: "wrap-12",
      category: "wraps",
      name: "BNB Paneer Cheese Wrap",
      price: 130,
      description: "Golden spiced paneer cubes topped with melted cheese and delicious wrap sauce"
    },
    {
      id: "wrap-13",
      category: "wraps",
      name: "BNB Veg Double Jack Wrap",
      price: 130,
      description: "Our king-size wrap with double portion filling, two special dressings and loads of flavor"
    },

    // Snackers (Page 2)
    {
      id: "snack-1",
      category: "snackers",
      name: "Regular French Fries",
      priceMedium: 70,
      priceLarge: 130,
      hasSizes: true,
      description: "Classic golden fried salted potatoes, crispy on the outside and fluffy inside"
    },
    {
      id: "snack-2",
      category: "snackers",
      name: "Mexican Chilly Fries",
      priceMedium: 130,
      priceLarge: 180,
      hasSizes: true,
      description: "Golden french fries tossed in bold Mexican salsa seasoning and chili flakes"
    },
    {
      id: "snack-3",
      category: "snackers",
      name: "Jalapeno Cheese Fries",
      priceMedium: 130,
      priceLarge: 180,
      hasSizes: true,
      description: "Fries smothered in warm jalapeno cheese sauce and topped with sliced pickled jalapenos"
    },
    {
      id: "snack-4",
      category: "snackers",
      name: "Peri Peri Masala Fries",
      priceMedium: 130,
      priceLarge: 180,
      hasSizes: true,
      description: "Crispy fries dusted with authentic African bird's eye peri-peri spice blend"
    },
    {
      id: "snack-5",
      category: "snackers",
      name: "XB Cheesy Fries",
      priceMedium: 130,
      priceLarge: 230,
      hasSizes: true,
      description: "Extra big portion of crispy fries drenched in rich, velvety liquid cheese"
    },
    {
      id: "snack-6",
      category: "snackers",
      name: "Chilly Cheese Fries",
      priceMedium: 130,
      priceLarge: 230,
      hasSizes: true,
      description: "The fiery combination of zesty chili sauce and decadent melted cheese on hot fries"
    },
    {
      id: "snack-7",
      category: "snackers",
      name: "Tandoori Chilly Fries",
      priceMedium: 130,
      priceLarge: 230,
      hasSizes: true,
      description: "Desi tandoori seasoned fries mixed with spicy green chilies and smoky dressing"
    },
    {
      id: "snack-8",
      category: "snackers",
      name: "XB Pizza Fries",
      priceMedium: 170,
      priceLarge: 300,
      hasSizes: true,
      description: "Fries baked with authentic pizza marinara, Italian herbs and generous mozzarella cheese"
    },
    {
      id: "snack-9",
      category: "snackers",
      name: "Veg Chilly Garlic Popcorn (12 Pcs)",
      price: 90,
      description: "Bite-sized crispy popcorn morsels seasoned with spicy chili garlic seasoning"
    },
    {
      id: "snack-10",
      category: "snackers",
      name: "Veg Cheese Jalapeno Popcorn (10 Pcs)",
      price: 100,
      description: "Crispy exterior giving way to a warm molten cheese and spicy jalapeno core"
    },
    {
      id: "snack-11",
      category: "snackers",
      name: "Veg Regular Nuggets (9 Pcs)",
      price: 100,
      description: "Nine golden brown, seasoned vegetable nuggets served piping hot"
    },

    // Pizza (Page 2)
    {
      id: "pizza-1",
      category: "pizza",
      name: "Maargarita Pizza",
      price: 200,
      description: "Traditional Italian delight with classic San Marzano style tomato sauce and 100% mozzarella"
    },
    {
      id: "pizza-2",
      category: "pizza",
      name: "Corn Cheese Pizza",
      price: 220,
      description: "Sweet American golden corn kernels layered generously over melted cheese and herb sauce"
    },
    {
      id: "pizza-3",
      category: "pizza",
      name: "Veg Classic Cheese Pizza",
      price: 200,
      description: "Rich blend of gourmet cheese blend baked to bubbly golden perfection on hand-tossed dough"
    },
    {
      id: "pizza-4",
      category: "pizza",
      name: "Veg Exotic Vegetable Pizza",
      price: 250,
      description: "Loaded with black olives, jalapenos, bell peppers, sweet corn, onions and fresh mozzarella"
    },
    {
      id: "pizza-5",
      category: "pizza",
      name: "Veg Farm House Pizza",
      price: 250,
      description: "Fresh garden tomatoes, crisp capsicum, diced onions, and mushrooms on seasoned tomato crust"
    },
    {
      id: "pizza-6",
      category: "pizza",
      name: "Veg Tandoori Paneer Pizza",
      price: 300,
      description: "Cubes of marinated tandoori paneer, red paprika, bell peppers, and smoky tandoori drizzle"
    },
    {
      id: "pizza-7",
      category: "pizza",
      name: "Veg Double Cheese Pizza",
      price: 300,
      description: "Double thickness mozzarella and cheddar cheese crust for ultimate indulgence"
    },

    // Dips & Add-ons (Page 2)
    {
      id: "dip-1",
      category: "dips",
      name: "Liquid Cheese Dip",
      price: 40,
      description: "Warm, smooth and velvety cheddar cheese dip"
    },
    {
      id: "dip-2",
      category: "dips",
      name: "Cheesy Jalapeno Dip",
      price: 40,
      description: "Tangy jalapeno infused creamy cheese dip with a gentle kick"
    },
    {
      id: "dip-3",
      category: "dips",
      name: "Smoky Tandoori Dip",
      price: 30,
      description: "Authentic smoked clay-oven spices blended in smooth dip"
    },
    {
      id: "dip-4",
      category: "dips",
      name: "Spicy Periperi Dip",
      price: 30,
      description: "Hot peri-peri chili dip packed with tangy garlic notes"
    },
    {
      id: "addon-1",
      category: "dips",
      name: "Slice Cheese (Add-on)",
      price: 20,
      description: "Extra slice of premium melted cheese for any burger or wrap"
    }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = BOBNBUNS_DATA;
}


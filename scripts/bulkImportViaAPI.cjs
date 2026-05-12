const fetch = require('node-fetch');

// Products data - simplified for API import
const productsData = [
  // WINTER COLLECTION PRODUCTS
  {
    name: "Red Checked Twill Cotton Flannel Shirt",
    slug: "red-checked-twill-cotton-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Made from soft Twill Cotton Flannel, this red checked shirt delivers warmth, comfort, and timeless style for light winter days. Featuring a classic check pattern and regular fit, it's perfect for casual outings, layering, and everyday wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/oukd6qqtf9hqctfgku6x8/ACjykQX6PkKS1ls12XCc-Z0?rlkey=9hp85ddffys1i9qc0eldpc919&st=dfxwirn7&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Classic Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "checked", "casual"]
  },
  {
    name: "Classic Blue Checks Flannel Shirt",
    slug: "classic-blue-checks-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Crafted from premium Twill Cotton Flannel, this blue checkered shirt offers a soft feel with all-day comfort. Designed with a regular fit, full sleeves, and dual flap pockets, it's perfect for casual outings, office wear, and everyday styling.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/z4yt4dgiyxhrfeiqvwtgg/AJENaMezQtYIL5RG-FMGtOs?rlkey=he8dp1gcgi7kvp7hkox22s8n3&st=5nbt4ao2&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checkered",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Front Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Smart Casual",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "checkered", "casual"]
  },
  {
    name: "Men's Charcoal Checked Flannel Shirt",
    slug: "mens-charcoal-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Made from premium Twill Cotton Flannel, this charcoal checked shirt combines soft warmth with timeless style. Featuring a classic check pattern and dual flap pockets, it's perfect for light winter layering, casual outings, and everyday wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/3y4f9nnps89vb954vpfax/ALyeQwC-qHT82FcbKsIjda8?rlkey=wilmd6wkgthystefzjrwro011&st=vw50wabw&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "checked", "casual"]
  },
  {
    name: "Men's Olive Green Checked Flannel Shirt",
    slug: "mens-olive-green-checked-flannel-shirt",
    price: 1999,
    mrp: 1999,
    description: "Crafted from soft Twill Cotton Flannel, this olive green checked shirt offers warmth, comfort, and everyday versatility. Designed with a clean check pattern and dual flap pockets, it's perfect for light winter layering, casual outings, and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fi/u13hdu03prg1lheaofn0x/1.png?rlkey=v7b0visygrz50bm7zhb9h4jin&st=0y6zgm09&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "olive", "checked"]
  },
  {
    name: "Men's Red & White Checked Flannel Shirt",
    slug: "mens-red-white-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Made from premium Twill Cotton Flannel, this red and white checked shirt offers a soft feel, breathable comfort, and light warmth for cooler days. Featuring a timeless check pattern and versatile regular fit, it's ideal for casual outings, layering, and everyday winter styling.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/r9mmdxqtpr4t7hjdknsbw/AED60hwsgMwuJmEsNjrMebk?rlkey=exmy4dhby0ujsl2f849qm9yy9&st=431ozglb&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Large Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Front Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "checked", "red-white"]
  },
  {
    name: "Men's Olive Black Checked Flannel Shirt",
    slug: "mens-olive-black-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Crafted from soft brushed cotton flannel, this olive and black checked shirt delivers warmth, comfort, and timeless rugged appeal. Featuring a detailed plaid pattern with dual chest pockets and a regular fit, it's an ideal choice for layered winter outfits and everyday casual wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/ozaph3xp87jc4nx9xlpvt/AKW0haRSD-6M8h_k5DlYzgI?rlkey=v9bjueylptxn4oofw6y4qpkwf&st=6nhfife6&dl=0"],
    specifications: {
      "Fabric": "Brushed Cotton Flannel",
      "Pattern": "Multi-Check Plaid Pattern",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Classic Spread Collar",
      "Pocket": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual Wear, Winter Wear, Outdoor Styling",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "plaid", "olive-black"]
  },
  {
    name: "Men's Charcoal Grey Checked Flannel Shirt",
    slug: "mens-charcoal-grey-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Stay effortlessly stylish with this charcoal grey checked flannel shirt crafted from soft brushed cotton fabric. Featuring a subtle windowpane check design, full sleeves, and a comfortable regular fit, this shirt is perfect for layering during cooler days while maintaining a clean casual look.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/5ckf9bxo9nm4ot8ml1zdz/AHEEPXm3llCRQYIREy9_0uI?rlkey=35by57fgzfs27dl7jav8uwyzb&st=l0ztuki3&dl=0"],
    specifications: {
      "Fabric": "Brushed Cotton Flannel",
      "Pattern": "Windowpane Checked Pattern",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pocket": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual Wear, Winter Wear, Everyday Styling",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "charcoal", "checked"]
  },
  {
    name: "Men's Red Tartan Checked Flannel Shirt",
    slug: "mens-red-tartan-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Refresh your casual collection with this red and black checked shirt designed for versatile everyday styling. Crafted from soft breathable fabric with a timeless check pattern, it offers lasting comfort and an effortlessly stylish look perfect for casual outings and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/kvhg19i054gax1yhlyru3/AByEzkE-YYGg9gw1W5NTqV4?rlkey=hxup7cuuevk0npan946u7m6rb&st=45dza1ou&dl=0"],
    specifications: {
      "Fabric": "Brushed Cotton Flannel",
      "Pattern": "Tartan Checked Pattern",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Classic Spread Collar",
      "Pocket": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual Wear, Winter Wear, Outdoor Style",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "tartan", "red-black"]
  },
  {
    name: "Men's Red & Black Checked Casual Shirt",
    slug: "mens-red-black-checked-casual-shirt",
    price: 1111,
    mrp: 1199,
    description: "Refresh your casual collection with this red and black checked shirt designed for versatile everyday styling. Crafted from soft breathable fabric with a timeless check pattern, it offers lasting comfort and an effortlessly stylish look perfect for casual outings and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/ygx0pwexty22twu2ahks8/AE7CX6t4M0CclzDbOfu4bp4?rlkey=z916vwozhbv45w8qga7dy9515&st=h5k9fgsm&dl=0"],
    specifications: {
      "Fabric": "Soft Cotton Blend",
      "Pattern": "Checked Pattern",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pocket": "Single Chest Pocket",
      "Closure": "Button-Up Front",
      "Occasion": "Casual Wear, Daily Wear, Weekend Outfits",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "casual", "checked", "red-black"]
  },
  {
    name: "Men's Red & Black Buffalo Checked Flannel Shirt",
    slug: "mens-red-black-buffalo-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Designed with iconic red and black buffalo checks, this brushed flannel shirt combines rugged style with everyday comfort. The soft brushed fabric offers warmth and a cozy feel, while regular fit and dual chest pockets add timeless utility-inspired appeal for casual winter dressing.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/ocuyvi8son1bsvye3fd3b/AMvF03FTiptFkcAo7dLfYSA?rlkey=hdgk9zidnoacsuxw9d1lv20p2&st=uh2yao70&dl=0"],
    specifications: {
      "Fabric": "Brushed Cotton Flannel",
      "Pattern": "Buffalo Check Pattern",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Classic Spread Collar",
      "Pocket": "Dual Flap Chest Pockets",
      "Closure": "Full Button Placket",
      "Occasion": "Casual Wear, Winter Wear, Outdoor Style",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "buffalo", "red-black"]
  },
  {
    name: "Men's Red Checked Brushed Flannel Shirt",
    slug: "mens-red-checked-brushed-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Upgrade your winter wardrobe with this red checked brushed flannel shirt crafted for warmth and All-day comfort. Designed with a soft brushed finish, classic tartan checks, and a relaxed regular fit, it delivers a timeless casual look perfect for layering and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/ofogyb2rj0l8b85j57ovj/AAZcSrbbsJBGRyld3DSxAac?rlkey=klkf2mv0svr2n9l3ck316mxt9&st=fmk32jar&dl=0"],
    specifications: {
      "Fabric": "Brushed Cotton Flannel",
      "Pattern": "Tartan Checked Pattern",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pocket": "Dual Chest Pockets",
      "Closure": "Button Front Closure",
      "Occasion": "Casual, Winter Wear, Everyday Style",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "brushed", "red"]
  },
  {
    name: "Men's Red & Black Checked Flannel Shirt",
    slug: "mens-red-black-checked-flannel-shirt-2",
    price: 1111,
    mrp: 1199,
    description: "Crafted from brushed twill cotton flannel, this red and black checked shirt delivers a warm, soft feel with a rugged casual look. The bold check design and relaxed fit make it ideal for winter layering, weekend outings, and everyday comfort styling.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/lz1kidd7k9xxrpoko6v5m/AOcIRD_vqc_3NiHm7Tmdih8?rlkey=xuw2cruw8m6ag6m5wraxjgs4l&st=a1i0b1bk&dl=0"],
    specifications: {
      "Fabric": "Brushed Twill Cotton Flannel",
      "Pattern": "Large Checked Pattern",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Classic Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual, Winter & Outdoor Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "checked", "red-black"]
  },
  {
    name: "Men's Red Cream Checked Flannel Shirt",
    slug: "mens-red-cream-checked-flannel-shirt",
    price: 1499,
    mrp: 1499,
    description: "Made from premium Twill Cotton Flannel, this red cream checked shirt offers soft warmth and everyday comfort for cooler weather. Featuring a timeless check pattern and versatile regular fit, it's perfect for winter layering, casual outings, and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/wjnubtwlqm5ppb394y64l/AOGHx1GHb98v8mczKkA6-mQ?rlkey=r6jh4h3x3fpuisu79bpk53cbe&st=9e1ukupw&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pocket": "Chest Pocket",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "red-cream", "checked"]
  },
  {
    name: "Men's Black White Buffalo Checked Flannel Shirt",
    slug: "mens-black-white-buffalo-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Crafted from premium Twill Cotton Flannel, this black and white buffalo checked shirt offers soft warmth and rugged everyday style for cooler days. Featuring bold oversized checks and dual flap pockets, it's perfect for winter layering, casual outings, and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/9joinxddpisfp4xl51tp4/AMIRAgaZHY9MV4W19GXL62A?rlkey=w7k0nsk81x13kpzei4r12tknj&st=2xz5ch0r&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Buffalo Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "buffalo", "black-white"]
  },
  {
    name: "Men's Mustard Blue Checked Flannel Shirt",
    slug: "mens-mustard-blue-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Made from premium Twill Cotton Flannel, this mustard blue checked shirt offers soft warmth and all-day comfort for cooler weather. Featuring bold checks and dual flap pockets, it's perfect for casual winter styling, layering, and everyday wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/yehq0a6s6jnw5oioxvh56/AJtwIcGHTLGNyrn_eS7NFkA?rlkey=v6sjsdtrxafgi4bjdcq9z8mdw&st=lihoe61w&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Large Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "mustard", "blue"]
  },
  {
    name: "Men's Sage Green Checked Flannel Shirt",
    slug: "mens-sage-green-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Crafted from premium Twill Cotton Flannel, this sage green checked shirt offers soft warmth and breathable comfort for cooler days. Featuring a timeless check pattern and dual flap pockets, it's perfect for winter layering, casual outings, and everyday wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/2ap7orc8c9npn9yjmtex9/ADz947WuqUendKhLIwwoURs?rlkey=izx464nv99v2ukejpavgi42oo&st=9cwsk78p&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "sage", "green"]
  },
  {
    name: "Men's Royal Blue Checked Flannel Shirt",
    slug: "mens-royal-blue-checked-flannel-shirt",
    price: 1999,
    mrp: 1999,
    description: "Crafted from premium Twill Cotton Flannel, this royal blue checked shirt offers soft warmth and everyday comfort for cooler weather. Featuring a bold check pattern and dual flap pockets, it's perfect for casual winter styling, layering, and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fi/w802c4ctczzu510n1obvj/1.png?rlkey=cm2g867cnjpu4sdplioufrwna&st=unwqtjie&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "royal", "blue"]
  },
  {
    name: "Men's Olive Green Checked Flannel Shirt",
    slug: "mens-olive-green-checked-flannel-shirt-2",
    price: 1111,
    mrp: 1199,
    description: "Made from premium Twill Cotton Flannel, this olive green checked shirt offers soft warmth and everyday comfort for cooler days. Featuring a timeless check pattern and dual flap pockets, it's perfect for casual winter styling, layering, and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/x4bmiff6glh4fr98xfqu4/AF18dg6gQPR_L3eMZcp0qgY?rlkey=2me8jvo4l7mf65nxviolvir88&st=r2v796fg&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "olive", "green"]
  },
  {
    name: "Men's Red Black Buffalo Checked Flannel Shirt",
    slug: "mens-red-black-buffalo-checked-flannel-shirt-2",
    price: 1111,
    mrp: 1199,
    description: "Crafted from premium Twill Cotton Flannel, this red and black buffalo checked shirt delivers soft warmth, comfort, and rugged everyday style. Featuring bold checks and dual flap pockets, it's perfect for light winter layering, casual outings, and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fi/m3mjc1xeejvmvi3pul1wk/1.png?rlkey=mbomofm8ahyffgesuzd6g1w4h&st=rwlgfzzy&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Buffalo Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual Wear, Winter Wear, Outdoor Style",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "buffalo", "red-black"]
  },
  {
    name: "Men's Red Checked Brushed Flannel Shirt",
    slug: "mens-red-checked-brushed-flannel-shirt-2",
    price: 1111,
    mrp: 1199,
    description: "Upgrade your winter wardrobe with this red checked brushed flannel shirt crafted for warmth and All-day comfort. Designed with a soft brushed finish, classic tartan checks, and a relaxed regular fit, it delivers a timeless casual look perfect for layering and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/ofogyb2rj0l8b85j57ovj/AAZcSrbbsJBGRyld3DSxAac?rlkey=klkf2mv0svr2n9l3ck316mxt9&st=fmk32jar&dl=0"],
    specifications: {
      "Fabric": "Brushed Cotton Flannel",
      "Pattern": "Tartan Checked Pattern",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pocket": "Dual Chest Pockets",
      "Closure": "Button Front Closure",
      "Occasion": "Casual, Winter Wear, Everyday Style",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "brushed", "red"]
  },
  {
    name: "Men's Red & Black Checked Flannel Shirt",
    slug: "mens-red-black-checked-flannel-shirt-3",
    price: 1111,
    mrp: 1199,
    description: "Crafted from brushed twill cotton flannel, this red and black checked shirt delivers a warm, soft feel with a rugged casual look. The bold check design and relaxed fit make it ideal for winter layering, weekend outings, and everyday comfort styling.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/lz1kidd7k9xxrpoko6v5m/AOcIRD_vqc_3NiHm7Tmdih8?rlkey=xuw2cruw8m6ag6m5wraxjgs4l&st=a1i0b1bk&dl=0"],
    specifications: {
      "Fabric": "Brushed Twill Cotton Flannel",
      "Pattern": "Large Checked Pattern",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Classic Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual, Winter & Outdoor Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "checked", "red-black"]
  },
  {
    name: "Men's Beige Navy Checked Flannel Shirt",
    slug: "mens-beige-navy-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Made from premium Twill Cotton Flannel, this beige navy checked shirt offers soft warmth and All-day comfort for cooler weather. Featuring bold checks and dual flap pockets, it's perfect for casual winter styling, layering, and everyday wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/huhb8kcca95whiac6c8g8/AFlLcWRz_UtrmfettLjIygI?rlkey=2n99pp0e5zx0xnvtl61us2lfx&st=6k7fx8th&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Large Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "beige", "navy"]
  },
  {
    name: "Men's Navy Beige Checked Flannel Shirt",
    slug: "mens-navy-beige-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Crafted from premium Twill Cotton Flannel, this navy beige checked shirt delivers soft warmth and All-day comfort for cooler weather. Featuring a timeless check pattern and versatile regular fit, it's perfect for casual outings, winter layering, and everyday styling.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/6cskq9w81iakcrkhikkcy/AI24LPy2lw4KWlEbkEJlz-0?rlkey=c3hnqfpaz1nt14zn8antxwef3&st=x0daibt3&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "navy", "beige"]
  },
  {
    name: "Men's Cream Checked Flannel Shirt",
    slug: "mens-cream-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Made from premium Twill Cotton Flannel, this cream checked shirt offers soft warmth and everyday comfort for cooler days. Featuring a classic check pattern with dual flap pockets, it's perfect for casual outings, winter layering, and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/u9bzk938yk9b7rvoqw9r1/AGpQewtIE93dyBcMcvB2Pg8?rlkey=82yfttdg42cc64f71s70x394n&st=ns5n1574&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "cream", "checked"]
  },
  {
    name: "Men's Black & Sky Blue Checked Flannel Shirt",
    slug: "mens-black-sky-blue-checked-flannel-shirt",
    price: 1499,
    mrp: 1499,
    description: "Crafted from soft Twill Cotton Flannel, this black and sky blue checked shirt offers warmth, comfort, and effortless everyday style. Featuring a bold check pattern with a comfortable regular fit, it's perfect for light winter layering, casual outings, and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/kbk2kf5h1adismqgnhcbt/AOZh_MFgIiH4ChJz1HYoRDA?rlkey=jghmf64u1rbdch9cmh34widdw&st=fha7lmz3&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pocket": "Chest Pocket",
      "Closure": "Button-Up Front",
      "Occasion": "Casual Wear, Winter Wear, Everyday Styling",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "black", "sky-blue"]
  },
  {
    name: "Men's Black Checked Flannel Shirt",
    slug: "mens-black-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Made from premium Twill Cotton Flannel, this black checked shirt offers a soft feel, breathable comfort, and light warmth for cooler days. Featuring a timeless check pattern and regular fit, it's perfect for casual outings, layering, and everyday winter styling.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/eznr6uy36xb5sns4gn6i3/AIaqBeNMLunnf7-L8UbzmOs?rlkey=ufykkadah2fy0ww34smdri2s1&st=ml25wc9j&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pocket": "Chest Pocket",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "black", "checked"]
  },
  {
    name: "Men's Blue Grey Checked Flannel Shirt",
    slug: "mens-blue-grey-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Crafted from premium Twill Cotton Flannel, this blue grey checked shirt offers soft comfort and light warmth for everyday winter wear. Featuring a classic check design and versatile regular fit, it's perfect for casual outings, layering, and all-day styling.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/o7qyuruaxde7r1913k7zn/AGyK_ZzaLOYUfp10FfVItWU?rlkey=mp3hg238rs0dey2dzl6t45wro&st=ifs3stf1&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pocket": "Chest Pocket",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "blue", "grey"]
  },
  {
    name: "Men's Navy Blue Checked Flannel Shirt",
    slug: "mens-navy-blue-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Made from soft Twill Cotton Flannel, this navy blue checked shirt delivers warmth, comfort, and timeless everyday style. Featuring a bold check pattern and regular fit, it's ideal for light winter layering, casual outings, and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/ghzg96wf90q8mrhw7d4ob/AGrLcyspEkgujfMI6m3mdMw?rlkey=ilephc9eed1j6buqm3dy64wo1&st=0tu917io&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "navy", "blue"]
  },
  {
    name: "Men's Green & Blue Checked Flannel Shirt",
    slug: "mens-green-blue-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Crafted from premium Twill Cotton Flannel, this green and blue checked shirt offers soft warmth and everyday comfort for cooler days. Designed with bold checks and dual flap pockets, it's perfect for casual winter styling, layering, and daily wear.",
    category: "men",
    collectionSlug: "winter-collection",
    images: ["https://www.dropbox.com/scl/fo/209d5bgkyboa4c2y0w61p/AOGJ6nmsoDV6xD8yyAaBFKM?rlkey=8dy09fshlh7v2p70gycr61wms&st=fzpti1mf&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Large Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["winter", "flannel", "green", "blue"]
  },

  // MONSOON COLLECTION PRODUCTS
  {
    name: "Men's Blue Checked Flannel Shirt",
    slug: "mens-blue-checked-flannel-shirt-monsoon",
    price: 1599,
    mrp: 1599,
    description: "Crafted from premium Twill Cotton Flannel, this blue checked shirt offers soft warmth and breathable comfort for cooler days. Featuring a classic check pattern and versatile regular fit, it's perfect for casual outings, winter layering, and everyday wear.",
    category: "men",
    collectionSlug: "monsoon-collection",
    images: ["https://www.dropbox.com/scl/fi/pr3cu0ojs9bp9548nmdy0/1.png?rlkey=euoudutao4h3mdouh7e4toupc&st=0yixvlbb&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pocket": "Chest Pocket",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["monsoon", "flannel", "blue", "checked"]
  },
  {
    name: "Men's Rust Orange Checked Flannel Shirt",
    slug: "mens-rust-orange-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Made from premium Twill Cotton Flannel, this rust orange checked shirt offers soft warmth and All-day comfort for cooler weather. Featuring a bold check pattern with a versatile regular fit, it's perfect for winter layering, casual outings, and everyday styling.",
    category: "men",
    collectionSlug: "monsoon-collection",
    images: ["https://www.dropbox.com/scl/fi/k8ju6bi0hzy7cuiv94h61/1.png?rlkey=uf2dw3x2vw889u24h2iqbfags&st=4arbketd&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pocket": "Chest Pocket",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["monsoon", "flannel", "rust", "orange"]
  },
  {
    name: "Men's Maroon Brushed Cotton Checked Shirt",
    slug: "mens-maroon-brushed-cotton-checked-shirt",
    price: 1499,
    mrp: 1499,
    description: "Crafted from soft brushed cotton fabric, this maroon checked shirt offers a smooth feel with lightweight warmth for cooler days. Designed with a subtle check pattern and regular fit, it's perfect for casual outings, office casuals, and everyday winter styling.",
    category: "men",
    collectionSlug: "monsoon-collection",
    images: ["https://www.dropbox.com/scl/fo/qd2ujdkfcw8bc1nglfs4h/AKdQCwvG6FeXMtJMVv0Pcp4?rlkey=1gpcmvm2yvk76yabqt56cnrfa&st=yc50163v&dl=0"],
    specifications: {
      "Fabric": "Brushed Cotton",
      "Pattern": "Subtle Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pocket": "Single Chest Pocket",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["monsoon", "brushed", "maroon", "checked"]
  },
  {
    name: "Men's Navy Grey Checked Flannel Shirt",
    slug: "mens-navy-grey-checked-flannel-shirt",
    price: 1111,
    mrp: 1199,
    description: "Crafted from premium Twill Cotton Flannel, this navy grey checked shirt delivers soft warmth, comfort, and timeless casual style. Featuring bold checks and dual flap pockets, it's perfect for light winter layering, casual outings, and everyday wear.",
    category: "men",
    collectionSlug: "monsoon-collection",
    images: ["https://www.dropbox.com/scl/fo/gvpifoke3yexcjypswcmu/APN5ZytsYBj88RrJ72LZuos?rlkey=qyq74xjhezfhdv6faegtbrx3d&st=fu1c1s0x&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["monsoon", "flannel", "navy", "grey"]
  },
  {
    name: "Men's Beige Navy Checked Flannel Shirt",
    slug: "mens-beige-navy-checked-flannel-shirt-monsoon",
    price: 1111,
    mrp: 1199,
    description: "Made from premium Twill Cotton Flannel, this beige navy checked shirt offers soft warmth and All-day comfort for cooler weather. Featuring bold checks and dual flap pockets, it's perfect for casual winter styling, layering, and everyday wear.",
    category: "men",
    collectionSlug: "monsoon-collection",
    images: ["https://www.dropbox.com/scl/fo/huhb8kcca95whiac6c8g8/AFlLcWRz_UtrmfettLjIygI?rlkey=2n99pp0e5zx0xnvtl61us2lfx&st=6k7fx8th&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Large Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["monsoon", "flannel", "beige", "navy"]
  },
  {
    name: "Men's Navy Beige Checked Flannel Shirt",
    slug: "mens-navy-beige-checked-flannel-shirt-monsoon",
    price: 1111,
    mrp: 1199,
    description: "Crafted from premium Twill Cotton Flannel, this navy beige checked shirt delivers soft warmth and All-day comfort for cooler weather. Featuring a timeless check pattern and versatile regular fit, it's perfect for casual outings, winter layering, and everyday styling.",
    category: "men",
    collectionSlug: "monsoon-collection",
    images: ["https://www.dropbox.com/scl/fo/6cskq9w81iakcrkhikkcy/AI24LPy2lw4KWlEbkEJlz-0?rlkey=c3hnqfpaz1nt14zn8antxwef3&st=x0daibt3&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["monsoon", "flannel", "navy", "beige"]
  },
  {
    name: "Men's Cream Checked Flannel Shirt",
    slug: "mens-cream-checked-flannel-shirt-monsoon",
    price: 1111,
    mrp: 1199,
    description: "Made from premium Twill Cotton Flannel, this cream checked shirt offers soft warmth and everyday comfort for cooler days. Featuring a classic check pattern with dual flap pockets, it's perfect for casual outings, winter layering, and daily wear.",
    category: "men",
    collectionSlug: "monsoon-collection",
    images: ["https://www.dropbox.com/scl/fo/u9bzk938yk9b7rvoqw9r1/AGpQewtIE93dyBcMcvB2Pg8?rlkey=82yfttdg42cc64f71s70x394n&st=ns5n1574&dl=0"],
    specifications: {
      "Fabric": "Twill Cotton Flannel",
      "Pattern": "Checked",
      "Fit": "Regular Fit",
      "Sleeves": "Full Sleeves",
      "Collar": "Spread Collar",
      "Pockets": "Dual Flap Chest Pockets",
      "Closure": "Button-Up Front",
      "Occasion": "Casual & Winter Wear",
      "Wash Care": "Machine Wash"
    },
    tags: ["monsoon", "flannel", "cream", "checked"]
  }
];

async function bulkImportProducts() {
  try {
    console.log('Starting bulk import via API...');

    // Process products in batches to avoid overwhelming the API
    const batchSize = 5;
    let totalCreated = 0;
    let totalErrors = 0;

    for (let i = 0; i < productsData.length; i += batchSize) {
      const batch = productsData.slice(i, i + batchSize);
      
      try {
        const response = await fetch('http://localhost:5002/api/products/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ products: batch })
        });

        const result = await response.json();
        
        if (result.success) {
          totalCreated += result.products.length;
          console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: Created ${result.products.length} products`);
        } else {
          totalErrors++;
          console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} error:`, result.message);
        }
        
        // Wait a bit between batches to avoid overwhelming
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        totalErrors++;
        console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} error:`, error.message);
      }
    }

    console.log(`\n🎉 BULK IMPORT COMPLETE!`);
    console.log(`✅ Total Products Created: ${totalCreated}`);
    console.log(`❌ Total Errors: ${totalErrors}`);
    console.log(`📊 Success Rate: ${((totalCreated / (totalCreated + totalErrors)) * 100).toFixed(1)}%`);
    
    // Count products by collection
    const winterCount = productsData.filter(p => p.collectionSlug === 'winter-collection').length;
    const monsoonCount = productsData.filter(p => p.collectionSlug === 'monsoon-collection').length;
    
    console.log(`\n📦 COLLECTION BREAKDOWN:`);
    console.log(`❄️ Winter Collection: ${winterCount} products`);
    console.log(`🌧️ Monsoon Collection: ${monsoonCount} products`);
    
  } catch (error) {
    console.error('❌ Bulk import error:', error);
  }
}

bulkImportProducts();

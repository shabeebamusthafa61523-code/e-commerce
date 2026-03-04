const OpenAI = require("openai").default;
const Product = require("../models/Product");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ----- AI Product Recommendations -----
// services/aiService.js
const getRecommendations = async (userActivity, currentProductId) => {
  try {
    const products = await Product.find();
    if (!products.length) return [];

    const viewedProducts = userActivity?.viewedProducts || [];
    const viewedIds = viewedProducts.map(p => p._id.toString());

    // Exclude current product & already viewed
    let filtered = products.filter(
      p => !viewedIds.includes(p._id.toString()) && p._id.toString() !== currentProductId
    );

    if (!filtered.length) return [];

    // Last viewed category
    const lastViewedCategory = viewedProducts.length
      ? viewedProducts[viewedProducts.length - 1].category?.toLowerCase()
      : null;

    // Split products into same-category and others
    let sameCategory = [];
    let otherCategory = [];

    filtered.forEach(p => {
      if (p.category?.toLowerCase() === lastViewedCategory) sameCategory.push(p);
      else otherCategory.push(p);
    });

    // Optional: shuffle same category for variety
    sameCategory.sort(() => Math.random() - 0.5);

    // Combine & limit to 5
    const topProducts = [...sameCategory, ...otherCategory].slice(0, 5);

    return topProducts;
  } catch (error) {
    console.error("Recommendation Error:", error);
    return [];
  }
};
// ----- AI Shopping Assistant -----




const aiSearchService = async (query) => {
  const lowerQuery = query.toLowerCase().trim();
  const products = await Product.find();

  if (!products.length) return [];

  const isWeightLoss = lowerQuery.includes("weight loss");
  const isHighProtein = lowerQuery.includes("high protein");
  const isPCOD = lowerQuery.includes("pcod");
  const isBudget = lowerQuery.includes("under");

  let filtered = [];

  // ✅ 1. WEEKLY BUDGET (Standalone)
  // ✅ WEEKLY GROCERIES (Budget Basket)
if (isBudget) {
  const priceMatch = lowerQuery.match(/under\s?₹?(\d+)/);

  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1]);

    filtered = products.filter(p => {
      const category = p.category?.toLowerCase() || "";
      const name = p.name?.toLowerCase() || "";
      const price = Number(p.price) || 0;

      const isEssentialCategory =
       
        category === "dairy" ||
        category === "rice" ||
        category === "spices" ||
         category === "vegetables" ||
        category === "fruits" ||
        category === "grains" ||
        category === "pulses";

      const isEssentialByName =
        name.includes("rice") ||
        name.includes("dal") ||
        name.includes("oil") ||
        name.includes("atta") ||
        name.includes("flour") ||
        name.includes("salt") ||
        name.includes("sugar");

      return (
        price <= maxPrice &&
        (isEssentialCategory || isEssentialByName)
      );
    });

   const priorityOrder = {
  rice: 1,
  pulses: 2,
  spices: 3,
  vegetables: 4,
  fruits: 5,
  dairy: 6,
};

filtered.sort((a, b) => {
  const aPriority = priorityOrder[a.category] || 99;
  const bPriority = priorityOrder[b.category] || 99;
  return aPriority - bPriority;
});

return filtered.slice(0, 25);
  }
}
  // ✅ 2. WEIGHT LOSS
  if (isWeightLoss) {
    filtered = products.filter(p =>
      ["vegetables", "fruits"].includes(
        p.category?.toLowerCase()
      )
    );
    return filtered.slice(0, 15);
  }

  // ✅ 3. HIGH PROTEIN
  if (isHighProtein) {
    filtered = products.filter(p => {
      const name = p.name?.toLowerCase() || "";
      return (
        name.includes("dal") ||
        name.includes("milk") ||
        name.includes("egg") ||
        name.includes("paneer")
      );
    });
    return filtered.slice(0, 15);
  }

  // ✅ 4. PCOD
  if (isPCOD) {
  filtered = products.filter(p => {
    const name = p.name?.toLowerCase() || "";
    const category = p.category?.toLowerCase() || "";

    return (
      ["vegetables", "fruits"].includes(category) ||
      name.includes("egg") ||
      name.includes("paneer")||
      name.includes("brown")
    );
  });

  return filtered.slice(0, 20);
}
  // ✅ 5. NORMAL SEARCH (rice, spices, etc.)
  const words = lowerQuery.split(" ");

  filtered = products.filter(p =>
    words.some(word =>
      p.name.toLowerCase().includes(word) ||
      p.category.toLowerCase().includes(word)
    )
  );

  return filtered.slice(0, 15);
};

module.exports = { aiSearchService,getRecommendations };
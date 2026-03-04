import ProductCard from "./ProductCard";

const ProductList = ({ products = [], search = "" }) => {

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!filteredProducts.length) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;

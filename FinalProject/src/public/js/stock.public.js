document.addEventListener("DOMContentLoaded", () => {
  const stockForm = document.getElementById("stockForm");

  stockForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(stockForm);
    const product = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      stock: formData.get("stock"),
      category: formData.get("category"),
      code: formData.get("code"),
    };

    await addProduct(product);
  });
});

async function addProduct(product) {
  try {
    const response = await fetch(`/api/stock/new-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Error creating stock.");
    }

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error(error.message); 
  }
}

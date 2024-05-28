document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.querySelectorAll('button[name="add"]');
  const lessButton = document.querySelectorAll('button[name="less"]');

  addButton.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productName = event.target
        .closest(".product-item")
        .querySelector(".product-name").textContent;
      await updateCart(productName, "add");
    });
  });

  lessButton.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productName = event.target
        .closest(".product-item")
        .querySelector(".product-name").textContent;
      await updateCart(productName, "less");
    });
  });
});

async function updateCart(productName, action) {
  try {
    const response = await fetch(`/api/cart/${productName}/product/${action}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error("Error updating cart");
    }

    const data = await response.json();
    console.log(data.message); 
  } catch (error) {
    console.error(error.message); 
  }
};
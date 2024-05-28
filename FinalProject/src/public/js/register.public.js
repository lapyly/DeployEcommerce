document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(registerForm);
    const user = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      age: formData.get("age"),
    };

    await registerUser(user);
  });
});

async function registerUser(user) {
  try {
    const response = await fetch(`/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Error creating user.");
    }

    const data = await response.json();
    console.log(data.message); 
  } catch (error) {
    console.error(error.message); 
  }
}

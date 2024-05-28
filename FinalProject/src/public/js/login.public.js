document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

    
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const user = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    await loginUser(user);
  });

    
  const registerButton = document.querySelector("button.register");
  registerButton.addEventListener("click", () => {
    window.location.href = "/register";
  });

    
  const forgotPasswordButton = document.querySelector("button.forgot-password");
  forgotPasswordButton.addEventListener("click", () => {
    window.location.href = "/new-password";
  });
});

async function loginUser(user) {
  try {
    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Error logging in.");
    }

    const data = await response.json();
    console.log(data.message); 
    
    window.location.href = "/stock";
  } catch (error) {
    console.error(error.message); 
  }
}

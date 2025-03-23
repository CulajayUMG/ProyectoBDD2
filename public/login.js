document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();  // Evitar que se recargue la página

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    const messageElement = document.getElementById("message");

    if (result.success) {
        messageElement.textContent = "¡Conexión exitosa!";
        messageElement.style.color = "green";
    } else {
        messageElement.textContent = "Error: " + result.message;
        messageElement.style.color = "red";
    }
});

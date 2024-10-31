document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // استرجاع بيانات المستخدم من localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
        alert("Login successful!");
        window.location.href = "dashboard.html";  // التوجيه لصفحة الأدمن أو الصفحة الرئيسية
    } else {
        alert("Invalid email or password. Please try again.");
    }
});

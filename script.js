let users = JSON.parse(localStorage.getItem("apnaUsers")) || {};
let currentUser = localStorage.getItem("loggedUser") || null;

const courseFees = {
  "BCA": 4000,
  "BBA": 4500,
  "B.Tech": 6000
};

function showSignup() {
  $("#login-page").hide();
  $("#signup-page").show();
}

function showLogin() {
  $("#signup-page").hide();
  $("#login-page").show();
}

function signup() {
  let name = $("#name").val().trim();
  let admission = $("#admission").val().trim();
  let password = $("#password").val().trim();
  let course = $("#course").val();

  if (!name || !admission || !password || !course) {
    alert("All fields are required.");
    return;
  }

  if (users[admission]) {
    alert("Admission number already registered!");
    showLogin();
    return;
  }

  users[admission] = {
    name,
    password,
    course,
    totalFees: courseFees[course],
    paid: 0
  };

  localStorage.setItem("apnaUsers", JSON.stringify(users));
  alert("Signup successful!");
  showLogin();
}

function login() {
  let admission = $("#login-id").val().trim();
  let password = $("#login-pass").val().trim();

  if (!users[admission] || users[admission].password !== password) {
    alert("Invalid credentials.");
    return;
  }

  localStorage.setItem("loggedUser", admission);
  window.location.href = "student.html";
}

function logout() {
  localStorage.removeItem("loggedUser");
  window.location.href = "index.html";
}

function makePayment() {
  let amount = parseInt($("#pay-amount").val());
  if (isNaN(amount) || amount <= 0) {
    alert("Enter a valid amount.");
    return;
  }

  let user = users[currentUser];
  user.paid += amount;
  if (user.paid > user.totalFees) user.paid = user.totalFees;

  localStorage.setItem("apnaUsers", JSON.stringify(users));
  showStudentInfo();
  $("#pay-amount").val("");
}

function showStudentInfo() {
  if (!currentUser || !users[currentUser]) {
    alert("You must log in first!");
    window.location.href = "index.html";
    return;
  }

  let user = users[currentUser];
  $("#welcome-msg").text(`Welcome, ${user.name}`);
  $("#s-id").text(currentUser);
  $("#s-course").text(user.course);
  $("#s-total").text(user.totalFees);
  $("#s-paid").text(user.paid);
  $("#s-remaining").text(user.totalFees - user.paid);
}

// For student.html
if (window.location.pathname.includes("student.html")) {
  $(document).ready(() => {
    currentUser = localStorage.getItem("loggedUser");
    showStudentInfo();
  });
}

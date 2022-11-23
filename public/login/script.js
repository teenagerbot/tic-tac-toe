$(function() {
	$(".btn").click(function() {
		$(".form-signin").toggleClass("form-signin-left");
    $(".form-signup").toggleClass("form-signup-left");
    $(".frame").toggleClass("frame-long");
    $(".signup-inactive").toggleClass("signup-active");
    $(".signin-active").toggleClass("signin-inactive");
    $(".forgot").toggleClass("forgot-left");   
    $(this).removeClass("idle").addClass("active");
	});
});

// $(function() {
// 	$(".btn-signup").click(function() {
//   $(".nav").toggleClass("nav-up");
//   $(".form-signup-left").toggleClass("form-signup-down");
//   $(".success").toggleClass("success-left"); 
//   $(".frame").toggleClass("frame-short");
// 	});
// });

  document.querySelector(".form-signin").onsubmit = (r) => {
    r.preventDefault();
//     var email = document.querySelector("#username").value;
//     var password = document.querySelector("#password").value;
//     var url = "https://tic-tac-toe.teleweb.repl.co/login";
//     var data = {
//       username: email,
//       password: password,
//     };
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.onreadystatechange = function() {//Call a function when the state changes.
//     if(xhr.readyState == 4 && xhr.status == 200) {
//         alert(xhr.responseText);
//     }
// }
// xhr.send(data);
  }
$(".btn-signin").click(function(r) {
  r.preventDefault();
  document.querySelector(".form-signin").submit();
});
$(".btn-signup").click(function(r) {
  r.preventDefault();
  document.querySelector(".form-signup").submit();
});
// $(function() {
// 	$(".btn-signin").click(function() {
//     document.querySelector(".form-signin").submit();
//   $(".btn-animate").toggleClass("btn-animate-grow");
//   $(".welcome").toggleClass("welcome-left");
//   $(".cover-photo").toggleClass("cover-photo-down");
//   $(".frame").toggleClass("frame-short");
//   $(".profile-photo").toggleClass("profile-photo-down");
//   $(".btn-goback").toggleClass("btn-goback-up");
//   $(".forgot").toggleClass("forgot-fade");
// 	});
// });

var socket = io();
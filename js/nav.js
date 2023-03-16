"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

async function navAllStories(evt) {
  hidePageComponents();
  // putStoriesOnPage();
  await getAndShowStoriesOnStart();
}
// shows favorited stories of currentUser
function navMyFavorites(evt) {
  hidePageComponents();
  putFavoritesOnPage();
}

//shows stories create by currentUser
function navMyStories(evt) {
  hidePageComponents();
  putMyStoriesOnPage();
}

/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

/** When a user first logins in, update the navbar to reflect that. */
function updateNavOnLogin() {
  $navLogin.hide();
  $navLogOut.show();
  $(".main-nav-links").show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
//hides or shows submit story form
function navSubmitClick(e) {
  e.preventDefault();
  $submitStoryForm.toggleClass("hidden");
}

$body.on("click", "#nav-my-stories", navMyStories);
$navLogin.on("click", navLoginClick);
$navSubmit.on("click", navSubmitClick);
$body.on("click", "#nav-favorites", navMyFavorites);
$body.on("click", "#nav-all", navAllStories);

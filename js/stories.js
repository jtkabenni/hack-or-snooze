"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();

  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}
// adds story to server and currentUser variable
async function addStory(evt) {
  evt.preventDefault();
  const author = $("#submit-author").val();
  const title = $("#submit-title").val();
  const url = $("#submit-url").val();
  const newStory = { author, title, url };
  const story = await StoryList.addStory(currentUser, newStory);
  currentUser.ownStories.push(story);

  $submitStoryForm.trigger("reset");
  $submitStoryForm.hide();
  storyList = await StoryList.getStories();
  putStoriesOnPage();
}
// deletes story to server and currentUser variable
async function deleteStory(evt) {
  const id = evt.target.closest("li").id;
  const story = storyList.stories.find((s) => s.storyId === id);
  await StoryList.deleteStory(story);

  evt.target.closest("li").remove();
}
//
async function addStoryToFavorites(evt) {
  const id = evt.target.closest("li").id;
  const story = storyList.stories.find((s) => s.storyId === id);

  evt.target.classList.toggle("fa-star-o");
  evt.target.classList.toggle("fa-star");

  if ($(evt.target).hasClass("fa-star-o")) {
    await User.removeStoryFromFavorite(story);
  } else {
    await User.addStoryToFavorite(story);
  }
}
// return start and trash icons based on user and story status
function returnIcons(story) {
  if (!currentUser) {
    return "";
  }
  let eachFavoriteId = [];
  currentUser.favorites.forEach((favorite) =>
    eachFavoriteId.push(favorite.storyId)
  );
  const favoriteIcon = eachFavoriteId.includes(story.storyId)
    ? "fa-star"
    : "fa-star-o";

  let ownStoryId = [];
  currentUser.ownStories.forEach((own) => ownStoryId.push(own.storyId));
  const deleteIcon = ownStoryId.includes(story.storyId)
    ? `<span class = "delete"><i class="fa fa-trash" aria-hidden="true"></i></span>`
    : ``;

  return `<span class = "favorite"><i class="fa ${favoriteIcon}" aria-hidden="true"></i></span>${deleteIcon}`;
}
// returns html markup for individual story
function generateStoryMarkup(story) {
  const icons = returnIcons(story);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
    ${icons}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  $allStoriesList.empty();
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}
/** Gets favorites list from currentUser, generates  HTML, and puts on page. */
function putFavoritesOnPage() {
  $allFavorited.empty();
  for (let favorite of currentUser.favorites) {
    const $favorite = generateStoryMarkup(favorite);
    $allFavorited.append($favorite);
  }
  $allFavorited.show();
}
/** Gets created stories from currentUser, generates  HTML, and puts on page. */
function putMyStoriesOnPage() {
  $myStories.empty();
  for (let story of currentUser.ownStories) {
    const $myStory = generateStoryMarkup(story);
    $myStories.append($myStory);
  }
  $myStories.show();
}
$body.on("click", ".delete", deleteStory);
$submitStoryForm.on("submit", addStory);
$body.on("click", ".favorite", addStoryToFavorites);

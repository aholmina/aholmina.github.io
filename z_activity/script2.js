const jokeEl = document.getElementById("joke");
const jokeBtn = document.getElementById("joke-btn");

const generateJoke = () => {
  fetch("https://api.chucknorris.io/jokes/random")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Something Went Wrong (Not Funny)");
      }
      return response.json();
    })
    .then((data) => {
      jokeEl.innerHTML = data.value;
    })
    .catch((error) => {
      jokeEl.innerHTML = error.message;
    });
};

jokeBtn.addEventListener("click", generateJoke);
document.addEventListener("DOMContentLoaded", generateJoke);
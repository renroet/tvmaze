"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
let episodes = [];

async function getShowsByTerm( term) {
 const res = await axios.get('http://api.tvmaze.com/search/shows?', {params: {q: term}})
 const id = res.data[0].show.id
 const name = res.data[0].show.name
 const summary = res.data[0].show.summary
 let img;
 if(res.data[0].show.image) {
   img = res.data[0].show.image.original
 }
 else {
   img = "https://tinyurl.com/tv-missing"
 }
  return [{id, name, summary, img}]
 }

function populateShows(shows) {
 $showsList.empty();


 for (let show of shows) {
   const $show = $(
       `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
        <div class="card">
          <img
             src=${show.img}
             alt="Show Image"
             class="card-img-top">
          <div class="media-body">
            <h5 class="text-primary">${show.name}</h5>
            <div><small>${show.summary}</small></div>
            <button class="btn btn-outline-light btn-sm Show-getEpisodes">
              Episodes
            </button>
          </div>
        </div> 
      </div>
     `);


   $showsList.append($show); 
  
 }
}


async function searchForShowAndDisplay() {
 const term = $("#search-query").val();
 const shows = await getShowsByTerm(term);
 $episodesArea.hide();
 populateShows(shows);
 return episodes
}

$searchForm.on("submit", async function (evt) {
 evt.preventDefault();
 await searchForShowAndDisplay();
});

async function getEpisodesOfShow(id) {
 const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
 const currEpisodes = res.data
 for(let ep of currEpisodes) {
   const {id, name, season, number} = ep
   episodes.push({id, name, season, number})
 }
 return episodes
}

function populateEpisodes(episodes) {
 const $episodesList = $("#episodes-list")
 $episodesList.empty()
 for(let ep of episodes) {
   $("#episodes-list").append(`<li>${ep.name} Season(${ep.season}, episode ${ep.number})</li>`)
 }
 $episodesArea.show();
}


$('#shows-list').on('click', '.Show-getEpisodes', async function(e) {
 e.preventDefault()
 const id = $(this).closest('.Show').data('show-id')
 episodes = await getEpisodesOfShow(id)
 populateEpisodes(episodes)
 return episodes = [];
})

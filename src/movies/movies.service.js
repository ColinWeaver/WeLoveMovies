
const knex = require("../db/connection");



function list() {
  return knex("movies").select("*");
}

function isShowingList(){
return knex("movies_theaters").select("*").where({ is_showing: true });
}

function read(param){
return knex("movies").select("*").where({ movie_id: param });
}

function readTheaters(movieId){
  return knex("theaters as t")
  .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
  .select("t.*", "is_showing", "movie_id")
  .where({ "movie_id": movieId })
}

function readReviews(movieId){
  return knex("reviews as r")
  .join("critics as c", "c.critic_id", "r.critic_id")
  .select("r.*", "c.*")
  .where({ "r.movie_id": movieId })
  .groupBy("review_id")
  .then((reviewsArray) => reviewsArray.map((review) => {
    const criticObject = {};

    criticObject.critic_id = review.critic_id;
    delete review.critic_id;

    criticObject.preferred_name = review.preferred_name;
    delete review.preferred_name;

    criticObject.surname = review.surname;
    delete review.surname;

    criticObject.organization_name = review.organization_name;
    delete review.organization_name;
    
    criticObject.created_at = review.created_at;
    delete review.created_at;

    criticObject.updated_at = review.updated_at;
    delete review.updated_at;

    review.critic = criticObject;
    return review;
  }));
}



module.exports = {
  list,
  isShowingList,
  read,
  readTheaters,
  readReviews
};


const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");


function read(reviewId){
return knex("reviews").select("*").where({ review_id: reviewId })
}

function destroy(reviewId){
    return knex("reviews").where({ review_id: reviewId }).del();
}

function update(updatedReview){
  return knex("reviews")
  .select("*")
  .where({review_id: updatedReview.review_id})
  .update({score: updatedReview.score, content: updatedReview.content})
}

function readUpdatedReview(reviewId){
  return knex("reviews as r")
  .join("critics as c", "c.critic_id", "r.critic_id")
  .select("r.*", "c.*")
  .where({review_id: reviewId})
  .first()
  .then(addCritic)
}

const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  organization_name: "critic.organization_name",
  surname: "critic.surname"
});




module.exports = {
  read,
  destroy,
  update,
  readUpdatedReview
};



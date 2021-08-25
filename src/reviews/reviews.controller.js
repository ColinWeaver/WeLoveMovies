const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");




async function reviewExists(req, res, next) {
  const review = await reviewsService.read(req.params.reviewId);
  if (review[0]) {
    res.locals.review = review[0];
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function destroy(req, res){
  const reviewId = res.locals.review.review_id;
  await reviewsService.destroy(reviewId);
  res.status(204).json("No Content");
}

async function update(req, res){
  const reviewId = res.locals.review.review_id;
  let updatedReview = req.body.data;
  updatedReview.review_id = reviewId;
  await reviewsService.update(updatedReview);
  const review = await reviewsService.readUpdatedReview(reviewId);
  res.json({ data: review });
}



module.exports = {
delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)]
};





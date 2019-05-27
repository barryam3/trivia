// Packaged utility functions.
//
// These methods abstract out the basic mechanism
// of creating server responses with some content
// (error code, message, etc.).
//
// Used verbatim from the notes app. Many thanks and appreciates.
module.exports = {
  /*
    Send a 200 OK with success:true in the request body to the
    response argument provided.
    The caller of this function should return after calling
  */
  sendErrorResponse: (res, errorCode, error) => {
    res
      .status(errorCode)
      .json({
        success: false,
        err: error
      })
      .end();
  },

  /*
    Send an error code with success:false and error message
    as provided in the arguments to the response argument provided.
    The caller of this function should return after calling
  */
  sendSuccessResponse: (res, content) => {
    res
      .status(200)
      .json({
        success: true,
        content: content || {}
      })
      .end();
  }
};

/**
 * res.login([inputs])
 *
 * @param {String} inputs.username
 * @param {String} inputs.password
 *
 * @description :: Log the requesting user in using a passport strategy
 * @help        :: See http://links.sailsjs.org/docs/responses
 */

module.exports = function login(inputs) {
  inputs = inputs || {};

  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  // Look up the user
  User.attemptLogin({
    email: inputs.email,
    password: inputs.password
  }, function (err, user) {
    if (err) return res.negotiate(err);
    if (!user) {

      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the login was successful.
      // (also do this if no `invalidRedirect` was provided)
      if (req.wantsJSON || !inputs.invalidRedirect) {
        return res.badRequest('Invalid username/password combination.');
      }
      // Otherwise if this is an HTML-wanting browser, redirect to /login.
      return res.redirect(inputs.invalidRedirect);
    }

    // "Remember" the user in the session
    // Subsequent requests from this user agent will have `req.session.me` set.
    req.session.me = user.id;

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a 200 response letting the user agent know the login was successful.
    // (also do this if no `successRedirect` was provided)
    if (req.wantsJSON || !inputs.successRedirect) {
      return res.ok();
    }

    // Otherwise if this is an HTML-wanting browser, redirect to /.
    return res.redirect(inputs.successRedirect);
  });

};


// NOTE:
//
// We could have done all (or part) of this in our UserController's `login` action.
// In many cases, that would actually be preferable.  This example uses a "fat" custom
// response to demonstrate how you can do it, and because we only have one type of login
// anyways.
//
// For instance, if we need the backend to support multiple user roles, with different
// login behavior, we might need to send back a few different kinds of success/failure
// codes, with different messages based on the outcome.  In that case, it would be most
// sensible to create a custom version of the logic here in the relevant controller action.
// There is absolutely nothing wrong with this!  It is just as much the "Sails way" :)
//
// On the other hand, if we needed to add a new login page somewhere else on the site,
// we might need to redirect to a different URL if that login failed (e.g. /checkout/login)
// However _everything else is almost exactly the same_. In this case, we might be able to
// use the `inputs` object in this custom response to make it **just configurable enough**
// to reuse this code.  If it doesn't work out- no problem, create a custom action.  But
// if it does work, it's a great way to keep things simple and conventional.
// (This approach sound familiar?  That's because it's basically how blueprint actions work.)
//
// For this example, we'll make the assumption that our app will have the following default
// login behavior:
// • success => either send a "200 OK" response or redirect to the home page
// • bad credentials => either send a "400 Bad Request" or redirect to `/login`
// • unexpected server error => call `res.negotiate()`
//                              (see `sailsjs.org/#/documentation` for more info on what
//                               `res.negotiate()` does)





const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const asyncBooksRoutes = require("./router/asyncBooks.js").asyncBooksRouter;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //check if the user is authenticated
  if (req.session.authorization) {
    const token = req.session.authorization.accessToken;
    jwt.verify(token, "fingerprint_customer", (err, user) => {
      if (err)
        return res.status(403).json({
          status: false,
          message: "User not authenticated",
          data: null,
        });

      req.user = user;
      next();
    });
  } else {
    return res.status(403).json({
      status: false,
      message: "User not Logeed in ",
      data: null,
    });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);
app.use("/async", asyncBooksRoutes); // new async / promise routes

app.listen(PORT, () => console.log("Server is running"));

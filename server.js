"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomePage = (req, res) => {
  res.render("pages/homepage.ejs", { users: users });
};

const handleProfilePage = (req, res) => {
  const _id = req.params.id;
  let user;
  users.forEach((userItem) => {
    if (userItem._id === _id) {
      user = userItem;
      res.status(200).render("pages/profile.ejs", {
        user: user,
        friends: friends(user),
      });
    }
  });
  res.status(400).send("Unable to find");
};

const friends = (user) => {
  let friendsList = [];
  for (let i = 0; i < user.friends.length; i++) {
    users.forEach((userInfo) => {
      if (userInfo._id === user.friends[i]) {
        friendsList.push(userInfo);
      }
    });
  }
  return friendsList;
};
// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomePage)
  //profile pages
  .get("/users/:id", handleProfilePage)
  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));

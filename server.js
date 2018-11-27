const knex = require("./version.js");
const Hapi = require("hapi");
const Bcrypt = require("bcrypt");

const server = Hapi.server({
  port: 3000,
  host: "localhost"
});

// IMPLEMENT VALIDATIONS BY CREATING A SCHEMA WITH JOI
// const Joi = require("joi");
//
// const schema = Joi.object()
//   .keys({
//     username: Joi.string()
//       .alphanum()
//       .min(3)
//       .max(30)
//       .required(),
//     password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
//     email: Joi.string().email({ minDomainAtoms: 2 })
//   })
//   .with("username", "password", "email");
//
// const result = Joi.validate({ username: 'abc', birthyear: 1994 }, schema);
// result.error === null -> valid

//INDEX LANDING PAGE
server.route({
  method: "GET",
  path: "/",
  handler: (request, h) => {
    return "eBay but better!";
  }
});

//REQUEST ALL USERS
server.route({
  method: "GET",
  path: "/allUsers",
  handler: (request, h) => {
    return knex.requestAllUsers();
  }
});

//REQUEST ALL AUCTIONS
server.route({
  method: "GET",
  path: "/allAuctions",
  handler: (request, h) => {
    return knex.requestAllAuctions();
  }
});

// CREATE NEW USER
server.route({
  method: "POST",
  path: "/createUser",
  handler: (request, h) => {
    let usernameInput = request.payload.username;
    let passwordInput = request.payload.password;
    let emailInput = request.payload.email;

    // let test = Joi.validate(
    //   { username: usernameInput, password: passwordInput, email: emailInput },
    //   schema
    // );

    // if (test.error === null) {
    knex.createUser(usernameInput, passwordInput, emailInput);
    return request.payload;
    // }
  }
});

//CREATE NEW AUCTION
server.route({
  method: "POST",
  path: "/createAuction",
  handler: (request, h) => {
    let createdAtInput = request.payload.created_at;
    let closedAtInput = request.payload.closed_at;
    let itemDescriptionInput = request.payload.item_description;
    let currentHighestBidderInput = request.payload.current_highest_bidder;
    let winnerInput = request.payload.winner;

    knex.createAuction(
      createdAtInput,
      closedAtInput,
      itemDescriptionInput,
      currentHighestBidderInput,
      winnerInput
    );

    return request.payload;
  }
});

//CREATE NEW BID
server.route({
  method: "POST",
  path: "/createBid",
  handler: (request, h) => {
    let usernameInput = request.payload.username;
    let auctionIdInput = request.payload.auction_id;
    let bidAmountInput = request.payload.bid_amount;
    let createdAtInput = request.payload.created_at;

    knex.createBid(
      usernameInput,
      auctionIdInput,
      bidAmountInput,
      createdAtInput
    );

    return request.payload;
  }
});

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();

//CHECK USER WON AUCTION
// server.route({
//   method: "GET",
//   path: "/checkWinner",
//   handler: (request, h) => {
//     let usernameInput = request.payload.username;
//     let auctionIdInput = request.payload.auction_id;
//
//     return knex.checkAuctionWinner(usernameInput, auctionIdInput);
//   }
// });

// LOGIN AUTH WITH HAPI AUTH
// const users = {
//   john: {
//     username: "john",
//     password: "$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm", // 'secret'
//     name: "John Doe",
//     id: "2133d32a"
//   }
// };
//
// const validate = async (request, username, password) => {
//   const user = users[username];
//   if (!user) {
//     return { credentials: null, isValid: false };
//   }
//
//   const isValid = await Bcrypt.compare(password, user.password);
//   const credentials = { id: user.id, name: user.name };
//
//   return { isValid, credentials };
// };

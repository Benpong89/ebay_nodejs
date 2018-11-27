// Write Knex functions here to manipulate the Postgres DB.
const options = {
  client: "pg",
  connection: {
    host: "localhost",
    user: "ben",
    password: "ben",
    database: "ebay"
  }
};

const knex = require("knex")(options);

function requestAllUsers() {
  knex
    .from("users")
    .select("*")
    .then(rows => {
      for (row of rows) {
        console.log(`${row["user_id"]} ${row["username"]} ${row["email"]}`);
      }
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
    .finally(() => {
      knex.destroy();
    });
}

function requestAllAuctions() {
  knex
    .from("auctions")
    .select("*")
    .then(rows => {
      for (row of rows) {
        console.log(
          `${row["auction_id"]} ${row["item_description"]} ${
            row["current_highest_bid"]
          } ${row["closed_at"]}`
        );
      }
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
    .finally(() => {
      knex.destroy();
    });
}

function createUser(username, password, email) {
  const user = [{ username: username, password: password, email: email }];

  knex("users")
    .insert(user)
    .then(() => console.log("user data inserted"))
    .catch(err => {
      console.log(err);
      throw err;
    })
    .finally(() => {
      knex.destroy();
    });
}

function createAuction(
  created_at,
  closed_at,
  item_description,
  current_highest_bid,
  winner
) {
  const auction = [
    {
      created_at: created_at,
      closed_at: closed_at,
      item_description: item_description,
      current_highest_bid: current_highest_bid,
      winner: winner
    }
  ];

  knex("auctions")
    .insert(auction)
    .then(() => console.log("auction data inserted"))
    .catch(err => {
      console.log(err);
      throw err;
    })
    .finally(() => {
      knex.destroy();
    });
}

async function createBid(username, auction_id, bid_amount, created_at) {
  const bid = [
    {
      username,
      auction_id,
      bid_amount,
      created_at
    }
  ];

  //Conditional here to check if bid date has passed.
  let bidCloseDate = (await knex("auctions").where({
    auction_id: auction_id
  }))[0].closed_at;

  //ENTER IN DATE HERE TO CHECK CONDITIONAL
  let date = new Date("2018-12-26");
  bidCloseDate = new Date(bidCloseDate);

  if (bidCloseDate > date) {
    // conditional here, check if this bid is the highest bid, if it is, run the knex update auction function.
    let highBid = knex("auctions").where({ auction_id: auction_id })
      .current_highest_bid;

    if (highBid < bid_amount || highBid === undefined) {
      updateAuction(auction_id, bid_amount);
    }

    knex("bids")
      .insert(bid)
      .then(() => console.log("bid data inserted"))
      .catch(err => {
        console.log(err);
        throw err;
      })
      .finally(() => {
        knex.destroy();
      });
  } else {
    return console.log(
      `Bid Close Date: ${bidCloseDate} Today: ${date}. Bid closed.`
    );
  }
}

function updateAuction(auction_id, bid_amount) {
  let highBid = knex("auctions").where({ auction_id: auction_id })
    .current_highest_bid;

  knex("auctions")
    .where({ auction_id: auction_id })
    .update({ current_highest_bid: bid_amount })
    .then(() => console.log("auction data updated"))
    .catch(err => {
      console.log(err);
      throw err;
    })
    .finally(() => {
      knex.destroy();
    });
}

//CHECK AUCTION WINNER REQUEST
// function checkAuctionWinner(username, auction_id) {
//   let auctionWinner = knex("auctions").where({ auction_id: auction_id }).winner;
//
//   if (auctionWinner === username || auctionWinner === undefined) {
//     knex("auctions")
//       .where({ auction_id: auction_id })
//       .then(() => console.log("Winner checked"))
//       .catch(err => {
//         console.log(err);
//         throw err;
//       })
//       .finally(() => {
//         knex.destroy();
//       });
//   } else {
//     return console.log("No winner.");
//   }
// }

module.exports = {
  createUser,
  createAuction,
  createBid,
  updateAuction,
  requestAllUsers,
  requestAllAuctions
  // checkAuctionWinner
};

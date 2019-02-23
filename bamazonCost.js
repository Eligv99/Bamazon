// Node modules 
var mysql = require("mysql");

var inquirer = require("inquirer");

var table = require("console.table");

var colors = require("colors");

var connection = mysql.createConnection({

  host     : 'localhost',

  port     : '3306',

  user     : 'root',

  password : 'Claramass123',

  database : 'bamazon'

});

connection.connect(function(err) {

  if (err) throw err;
  
  console.log("\nConnected to our database as ID... " + connection.threadId);

  bamazonIntro();
  bamazonCost();
});

function bamazonCost(){

  connection.query("SELECT * FROM products ORDER BY products.item_id", function(err, res){

    if (err) throw err;

    console.log(`\n================================================ Product List ===============================================\n\n`.rainbow);
    
    for (var i = 0; i < res.length; i++) {
      var item_id = res[i].item_id;
      var product_name = res[i].product_name;
      var price = res[i].price;
      var stock = res[i].stock_quantity;
  
      console.table(` | PRODUCT ID: ${item_id} | ${product_name} | $${price} | Stock quantity: ${stock} |\n`.red);
    }
    
    inquirer.prompt([
      {
      name: "pickedItem",
      type: "input",
      message: "What is the item [ID] you would like to submit?".red
      },
      
    ])
    .then(function(answer) {

      var query ="SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";

      connection.query(query, { item_id: answer.pickedItem },
        function (err, res) {

          if (err) throw err;

          console.log(`\nYou have choosen this item: ${res[0].product_name} For $${res[0].price}\n`.blue);

          inquirer.prompt([ 
            {
              name: "pickedQuantity",
              type: "input",
              message: "How much quantity of this item would you like?".red,
          
              validate: function (value) {

                if (isNaN(value) === false) {

                  if (value > res[0].stock_quantity) {

                    console.log(`\n\nThere's not enough stock to fulfill your request. Please enter a quantity lower than ${value}.\n`.red);
                    return false;
                  }
                  return true;
                }
                console.log(`\n Error: Please enter a number.`.red);
                return false;
              }
            },
            

          ])
          .then(function(answer){

            console.log(`\nOrder complete!\n`.blue);

            console.log(`Your total is $${answer.pickedQuantity * res[0].price}\n`.blue);

            console.log("Thank for shpping at Bamazon !\n".rainbow)

            // after our transaction is made we have to update our

            var NewStock = res[0].stock_quantity - answer.pickedQuantity;

            var itemID = res[0].item_id;

            var input = "UPDATE products SET ? WHERE ?";

            connection.query(input, 
            [
              {
                stock_quantity: NewStock,
              },

              {
                item_id: itemID,
              }

            ], 
            function (err) {
              if (err) throw err;

              inquirer
              .prompt([
                {
                  type: "confirm",
                  message: "Would you like to shop again?".red,
                  name: "confirm",
                  default: true
                }
              ])
              .then(function (response) {
                if (response.confirm) {
                  bamazonCost();
                } else {
                  console.log(`\nThanks for shopping Bamazon! See you next time.\n`.rainbow);
                  connection.end();
                }
              });

            });
          
          });

        },

      );



    });
  
    

  });
};

function bamazonIntro (){
  console.log("\n============================== Welcome to our online platform called 'Bamazon' ==============================\n ".red)
}  






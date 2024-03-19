import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Button, TextField, Dropdown, Flex, Box } from "monday-ui-react-core";
// import { json } from "stream/consumers";

/* 

mutation {
  create_item (board_id: 6274044724, group_id: "topics", item_name: "new item", column_values: "{\"text5\":\"Another Time\"}") {
    id
  }
} --- this is the format for creating new items 
*/

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState();
  const [boardID, setBoardID] = useState;

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen("context", (res) => {
      setContext(res.data);
    });
    monday.get("context").then((res) => {
      setBoardID(res.data.boardId);

      // test - set a new entry to the board
      monday.set("location");
    });
  }, []);

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  const attentionBoxText = `Hello, your user_id is: ${
    context ? context.user.id : "still loading"
  }.
  Let's start building your amazing app, which will change the world!`;

  return (
    <div className="App">
      <main id="main-section">
        {/* <form
          onSubmit={(event) => {
            event.preventDefault();
            console.log("submitted123123");
          }}
          id="order-form"
        >
          <button></button> */}
        <section id="input-section">
          <Box marginBottom={Box.marginBottoms.MEDIUM}>
            <Flex>
              <Box className="input">
                <TextField
                  title="First Name"
                  placeholder="Enter Customer First Name"
                  // requiredAsterisk={true}
                  // required={true}
                  size={TextField.sizes.LARGE}
                  type={TextField.types.TEXT}
                  className="input"
                />
              </Box>
              <Box className="input" marginX={Box.marginXs.XL}>
                <TextField
                  title="Last Name"
                  placeholder="Enter Customer Last Name"
                  // requiredAsterisk={true}
                  // required={true}
                  size={TextField.sizes.LARGE}
                  type={TextField.types.TEXT}
                  className="input"
                />
              </Box>
              <Box className="input">
                <TextField
                  title="Quantity"
                  placeholder="Enter Quantity"
                  // requiredAsterisk={true}
                  // required={true}
                  size={TextField.sizes.LARGE}
                  type={TextField.types.NUMBER}
                  className="input"
                  //todo check how to validate number less than 1
                  //todo check how to add required
                />
              </Box>
            </Flex>
          </Box>
        </section>
        <section id="dropdown-section">
          <Box marginBottom={Box.marginBottoms.MEDIUM}>
            <Dropdown />
          </Box>
        </section>
        <section id="button-section">
          <Button
            onClick={() => {
              // extract data from fields, save to data base, and add to form
            }}
          >
            Start Order
          </Button>
        </section>
        {/* </form> */}
      </main>
    </div>
  );
};

export default App;

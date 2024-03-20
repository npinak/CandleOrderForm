import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import {
  Button,
  TextField,
  Dropdown,
  Flex,
  Box,
  Combobox,
} from "monday-ui-react-core";

/* 

mutation {
  create_item (board_id: 6274044724, group_id: "topics", item_name: "new item", column_values: "{\"text5\":\"Another Time\"}") {
    id
  }
} --- this is the format for creating new items 
*/

const monday = mondaySdk();
monday.setApiVersion();

const App = () => {
  const [context, setContext] = useState();
  const [boardID, setBoardID] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [quantity, setQuantity] = useState();
  const [scents, setScents] = useState([]);
  const scentValues = [
    {
      value: 1,
      label: "Smokey",
    },
    {
      value: 2,
      label: "Fruity",
    },
    {
      value: 3,
      label: "Fresh",
    },
    {
      value: 4,
      label: "Citrus",
    },
    {
      value: 5,
      label: "Floral",
    },
    {
      value: 6,
      label: "Herbaceous",
    },
    {
      value: "Woody",
      label: "Woody",
    },
  ];
  const dropdownRef = useRef(null);

  useEffect(() => {
    console.log(quantity);
  }, [quantity]);
  // delete in pr

  useEffect(() => {
    monday.execute("valueCreatedForUser");

    monday.listen("context", (res) => {
      setContext(res.data);
    }); // todo might not be needed
    monday.get("context").then((res) => {
      setBoardID(res.data.boardId);
    });
  }, []);

  const createNewEntry = () => {
    //todo get values from the boxes
    //todo validation

    // if (scents.length !== 3) {
    //   monday.execute("notice", {
    //     message: "Please choose 3 scents",
    //     type: "error",
    //     timeout: 5000,
    //   });
    //   return;
    // } ///todo re-enable

    const inscription = "place holder";
    // const shippingAddress = "place holder"; -- todo add if core functionality is done
    const orderReceivedDate = new Date().toLocaleDateString("en-CA");
    const orderStatus = 0;
    const scentProfiles = scents.map((scent) => scent.value);

    //todo add to database

    monday
      .api(
        `mutation { create_item (board_id:${boardID}, group_id:  "topics", item_name: "New order", column_values: \"{\\\"text5\\\":\\\"${inscription}\\\",\\\"text\\\":\\\"${firstName}\\\", \\\"text6\\\":\\\"${lastName}\\\",\\\"dropdown\\\":\\\"${scentProfiles}\\\",\\\"status\\\":\\\"${orderStatus}\\\",\\\"date_1\\\":\\\"${orderReceivedDate}\\\",\\\"numbers\\\":\\\"${quantity}\\\"}\"){id}}`
      )
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
                  onChange={(event) => {
                    setFirstName(event);
                  }}
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
                  onChange={(event) => {
                    setLastName(event);
                  }}
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
                  onChange={(event) => {
                    setQuantity(event);
                  }}
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
          <Dropdown
            ref={dropdownRef}
            placeholder={"Choose 3 scents"}
            options={scentValues}
            onChange={(event) => {
              setScents(event);
            }}
            //todo nice to have if validation onClick otherwise its fine
            multi
            multiline
          />
          {/* </Box> */}
        </section>
        <section id="button-section">
          <Box marginTop={Box.marginTops.MEDIUM}>
            <Button
              onClick={() => {
                // extract data from fields, save to data base, and add to form
                createNewEntry();
              }}
            >
              Start Order
            </Button>
          </Box>
        </section>
        {/* </form> */}
      </main>
    </div>
  );
};

export default App;

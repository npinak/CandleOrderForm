import React from "react";
import { useState, useEffect, useRef } from "react";
import { db } from "./utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import MondayLogo from "./images/monday-ar21";
import {
  Button,
  TextField,
  Dropdown,
  Flex,
  Box,
  Combobox,
  Heading,
} from "monday-ui-react-core";

//todo validation for phone, email,
//todo implement undo functionality if time
//todo add firebase api to env
//done todo  get values from the boxes -- shipping, email, phone, inscription
//done todo update database when board is updated

const monday = mondaySdk();
monday.setApiVersion("2024-04");

const App = () => {
  const [boardID, setBoardID] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [scents, setScents] = useState([]);
  const [inscription, setInscription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

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
    monday.execute("valueCreatedForUser");

    monday.get("context").then((res) => {
      setBoardID(res.data.boardId);
    });
  }, []);

  const createNewEntry = async () => {
    if (scents.length !== 3) {
      monday.execute("notice", {
        message: "Please choose 3 scents",
        type: "error",
        timeout: 5000,
      });
      return;
    }

    if (quantity < 1) {
      monday.execute("notice", {
        message: "Please fill out order quantity",
        type: "error",
        timeout: 5000,
      });
      return;
    }

    const orderReceivedDate = new Date().toLocaleDateString("en-CA");
    const orderStatus = 0;
    const scentProfiles = scents.map((scent) => scent.value);

    try {
      const createResponse = await monday.api(
        `mutation { create_item (board_id:${boardID}, group_id:  "topics", item_name: "New order", column_values: \"{\\\"text5\\\":\\\"${inscription}\\\",\\\"text\\\":\\\"${firstName}\\\",\\\"client_email\\\":\\\"${email}\\\",\\\"long_text\\\":\\\"${address}\\\",\\\"phone\\\":\\\"${phone}\\\" ,\\\"text6\\\":\\\"${lastName}\\\",\\\"dropdown\\\":\\\"${scentProfiles}\\\",\\\"status\\\":\\\"${orderStatus}\\\",\\\"date_1\\\":\\\"${orderReceivedDate}\\\",\\\"numbers\\\":\\\"${quantity}\\\"}\"){id}}`
      );

      const orderID = createResponse.data.create_item.id;

      const newItemInfo = await monday.api(`query {items (ids: [${orderID}])
        {
          name
              id
              column_values{
                id
                value
                text
              }
            }
          }`);

      await setDoc(doc(db, `${boardID}`, `${orderID}`), {
        data: newItemInfo.data.items[0],
        status: "Active",
      });
    } catch (error) {
      console.error(error);
    }

    monday.execute("notice", {
      message: "Ordered added to board!",
      type: "success",
      timeout: 5000,
    });
  };

  return (
    <div className="App">
      <main id="main-section">
        <header id="header">
          <h1 id="candle-orders">Candle Orders</h1>
          <MondayLogo />
        </header>

        <section id="input-section">
          <Box marginBottom={Box.marginBottoms.LARGE}>
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
                    requiredAsterisk={true}
                    required={true}
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

            <Box marginBottom={Box.marginBottoms.MEDIUM}>
              <Flex>
                <Box className="input">
                  <TextField
                    title="Email"
                    placeholder="Enter Email"
                    // requiredAsterisk={true}
                    // required={true}
                    onChange={(event) => {
                      console.log(event);
                      setEmail(event);
                    }}
                    size={TextField.sizes.LARGE}
                    type={TextField.types.TEXT}
                    className="input"
                  />
                </Box>
                <Box className="input" marginX={Box.marginXs.XL}>
                  <TextField
                    title="Phone"
                    placeholder="Enter Phone Number"
                    // requiredAsterisk={true}
                    // required={true}
                    onChange={(event) => {
                      setPhone(event);
                    }}
                    size={TextField.sizes.LARGE}
                    type={TextField.types.TEXT}
                    className="input"
                    //todo check how to validate number less than 1
                    //todo check how to add required
                  />
                </Box>
                <Box className="input">
                  <TextField
                    title="Inscription"
                    placeholder="Enter Inscription"
                    // requiredAsterisk={true}
                    // required={true}
                    onChange={(event) => {
                      setInscription(event);
                    }}
                    size={TextField.sizes.LARGE}
                    type={TextField.types.TEXT}
                    className="input"
                    //todo check how to validate number less than 1
                    //todo check how to add required
                  />
                </Box>
              </Flex>
            </Box>
            <Box>
              <TextField
                title="Address"
                placeholder="Enter Address"
                // requiredAsterisk={true}
                // required={true}
                onChange={(event) => {
                  setAddress(event);
                }}
                size={TextField.sizes.LARGE}
                type={TextField.types.TEXT}
              />
            </Box>
          </Box>
        </section>
        <section id="dropdown-section">
          <Dropdown
            size={Dropdown.size.LARGE}
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
        </section>
        <section id="button-section">
          <Box marginTop={Box.marginTops.MEDIUM}>
            <Button
              onClick={() => {
                createNewEntry();
              }}
            >
              Start Order
            </Button>
          </Box>
        </section>
      </main>
    </div>
  );
};

export default App;

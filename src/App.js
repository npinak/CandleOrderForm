import React from "react";
import { useState, useEffect, useRef } from "react";
import { db } from "./utils/firebase";
import { doc, setDoc, collection, onSnapshot } from "firebase/firestore";
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
  AlertBanner,
  AlertBannerText,
} from "monday-ui-react-core";

const monday = mondaySdk();
monday.setApiVersion("2024-04");

const App = () => {
  const [boardID, setBoardID] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [scentsChosen, setScentsChosen] = useState([]);
  const [inscription, setInscription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fragrance, setFragrance] = useState([]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Fragrance"), (snapshot) => {
      const newFragranceArray = [];
      snapshot.docs.forEach((doc) => {
        const { value, label } = doc.data().fragrance;

        newFragranceArray.push({ value: value, label: label });
      });
      setFragrance(newFragranceArray);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    monday.execute("valueCreatedForUser");

    monday.get("context").then((res) => {
      setBoardID(res.data.boardId);
    });
  }, []);

  const createNewEntry = async () => {
    if (scentsChosen.length !== 3) {
      monday.execute("notice", {
        message: "Please choose only 3 scents",
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
    const scentProfiles = scentsChosen.map((scent) => scent.label);

    try {
      const createResponse = await monday.api(
        `mutation { create_item (board_id:${boardID}, group_id:  "topics", item_name: "New order", column_values: \"{\\\"text5\\\":\\\"${inscription}\\\",\\\"text\\\":\\\"${firstName}\\\",\\\"client_email\\\":\\\"${email}\\\",\\\"long_text\\\":\\\"${address}\\\",\\\"phone\\\":\\\"${phone}\\\" ,\\\"text6\\\":\\\"${lastName}\\\",\\\"scent_profiles7\\\":\\\"${scentProfiles}\\\",\\\"status\\\":\\\"${orderStatus}\\\",\\\"date_1\\\":\\\"${orderReceivedDate}\\\",\\\"numbers\\\":\\\"${quantity}\\\"}\"){id}}`
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
      monday.execute("notice", {
        message: "Ordered added to board",
        type: "success",
        timeout: 5000,
      });
    } catch (error) {
      console.error(error);
    }

    setFirstName("");
    setLastName("");
    setQuantity("");
    setInscription("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  return (
    <div className="App">
      <main id="main-section">
        <header id="header">
          <h1 id="candle-orders">Candle Orders</h1>
          <MondayLogo />
        </header>
        {scentsChosen.length > 3 ? (
          <Box marginBottom={Box.marginBottoms.MEDIUM}>
            <AlertBanner
              backgroundColor={AlertBanner.backgroundColors.WARNING}
              bannerText="Please select only 3 scents"
              className="monday-storybook-alert-banner_big-container"
            >
              <AlertBannerText text="Please select only 3 scents" />
            </AlertBanner>
          </Box>
        ) : (
          <></>
        )}

        <section id="input-section">
          <Box marginBottom={Box.marginBottoms.LARGE}>
            <Box marginBottom={Box.marginBottoms.MEDIUM}>
              <Flex>
                <Box className="input">
                  <TextField
                    title="First Name"
                    value={firstName}
                    placeholder="Enter Customer First Name"
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
                    value={lastName}
                    placeholder="Enter Customer Last Name"
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
                    value={quantity}
                    placeholder="Enter Quantity"
                    requiredAsterisk={true}
                    required={true}
                    onChange={(event) => {
                      setQuantity(event);
                    }}
                    size={TextField.sizes.LARGE}
                    type={TextField.types.NUMBER}
                    className="input"
                  />
                </Box>
              </Flex>
            </Box>

            <Box marginBottom={Box.marginBottoms.MEDIUM}>
              <Flex>
                <Box className="input">
                  <TextField
                    title="Email"
                    value={email}
                    placeholder="Enter Email"
                    onChange={(event) => {
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
                    value={phone}
                    placeholder="Enter Phone Number"
                    onChange={(event) => {
                      setPhone(event);
                    }}
                    size={TextField.sizes.LARGE}
                    type={TextField.types.TEXT}
                    className="input"
                  />
                </Box>
                <Box className="input">
                  <TextField
                    title="Inscription"
                    value={inscription}
                    placeholder="Enter Inscription"
                    onChange={(event) => {
                      setInscription(event);
                    }}
                    value={inscription}
                    size={TextField.sizes.LARGE}
                    type={TextField.types.TEXT}
                    className="input"
                  />
                </Box>
              </Flex>
            </Box>
            <Box>
              <TextField
                title="Address"
                value={address}
                placeholder="Enter Address"
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
            requiredAsteris={true}
            required={true}
            placeholder={"Choose 3 scents"}
            options={fragrance}
            onChange={(event) => {
              if (event === null) {
                setScentsChosen([]);
                return;
              }

              setScentsChosen(event);
            }}
            clearable
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

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import React from "react";
import Tabs from "@mui/material/Tabs";

function Content() {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newTab: number) => {
    setCurrentTab(newTab);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label="Comments" />
          <Tab label="Summery" />
          <Tab label="Notes" />
          <Tab label="Saved" />
        </Tabs>
      </Box>
    </Box>
  );
}

export default Content;

import React from "react";
import { Box, Stack, Typography } from "@mui/material";

function ClientsTestimonials() {
  return (
    <Box className="clientstestimonial">
      <Stack className="testimonialcontent">
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            width="200px"
            src="https://assets.capterra.com/badge/686709342337db91a58091b16c44513d.svg?v=2118363&p=170822"
            alt=""
          />
        </Box>
        <Stack className="clientreviewbox">
          <Box sx={{ marginTop: "30px" }}>
            <img width="65px" src="../public/profile.png" alt="" />
          </Box>
          <Box sx={{ position: "relative" }}>
            <Typography color="black" className="reviewpara" variant="body2">
              “Uizard is a design platform that looks good and works well. It's
              the best tool I've found. I wish I could find other words than
              just it's amazingly easy to use, but it's true! It's extremely
              user friendly”
            </Typography>
          </Box>
          <Box className="arrow">
            <img
              src="https://app.uizard.io/static/media/Cursor.dcbbd2226fb2026401ebe63617bb76f4.svg"
              alt=""
            />
          </Box>
          <Stack className="reviewsmallbox">
            <Typography>April Lorenzen,</Typography>
            <Typography>Founder & Data Scientist,</Typography>
            <Typography>ZETAlytics</Typography>
          </Stack>
        </Stack>
        <Box className="lastmsg">
          <Typography color="black" variant="p">
            Join 3,000,000+ professionals who trust Uizard with their design
            needs
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default ClientsTestimonials;

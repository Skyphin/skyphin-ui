import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { styled, ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App.tsx";
import theme from "./theme.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import MuiContainer, { ContainerProps } from "@mui/material/Container";

const Container = styled((props: ContainerProps) => (
  <MuiContainer
    sx={{ padding: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 } }}
    {...props}
  />
))``;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false}>
        <App />
      </Container>
    </ThemeProvider>
  </StrictMode>
);

import { useContext } from "react";
import { UrlContext } from "../contexts/UrlContext";

export const useUrl = () => {
  const context = useContext(UrlContext);
  if (context === undefined) {
    throw new Error("useUrl must be used within a UrlProvider");
  }
  return context;
};

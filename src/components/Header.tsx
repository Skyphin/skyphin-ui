import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function Header({ title, url }: { title: string; url: string }) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="caption">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          sx={{
            wordBreak: "break-word",
          }}
          variant="caption"
        >
          {url}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export default Header;

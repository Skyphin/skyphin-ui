import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ForumIcon from "@mui/icons-material/Forum";
import BookmarkIcon from "@mui/icons-material/Bookmark";

function Action() {
  return (
    <Box
      sx={{
        "& > :not(style)": { m: 1 },
        width: "100%",
        position: "fixed",
        bottom: 0,
        boxShadow: 3, // Adds a slight shadow for better visibility
      }}
    >
      <Fab variant="extended">
        <ThumbUpIcon sx={{ mr: 1 }} />0
      </Fab>
      <Fab variant="extended">
        <ThumbDownIcon sx={{ mr: 1 }} />0
      </Fab>
      <Fab variant="extended">
        <ForumIcon sx={{ mr: 1 }} />0
      </Fab>
      <Fab variant="extended">
        <BookmarkIcon />
      </Fab>
    </Box>
  );
}

export default Action;

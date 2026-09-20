import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`Backend démarré sur http://localhost:${port}`);
});
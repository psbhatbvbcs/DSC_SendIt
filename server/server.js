import { PORT, app } from "./app.js";
import { connectDb } from "./config/connectDb.js";

connectDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

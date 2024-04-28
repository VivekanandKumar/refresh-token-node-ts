import app from "./src/app";
import connectDB from "./src/DB/database";
import { config } from "./src/config/config";
(async () => {
    await connectDB();
    app.listen(config.port, async () => {
        console.log('Server started');
    })
})();

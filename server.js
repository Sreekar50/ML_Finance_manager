const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDb = require("./config/connectDb");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require('fs');

// config dot env file
dotenv.config();
                                                
//database call                                 
connectDb();

//rest object
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000' // Ensure this matches your frontend URL
}));
app.use(fileUpload({
    createParentPath: true 
}));


const staticDir = path.join(__dirname, 'static');
if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
}


app.use('/static', express.static(staticDir));


app.use("/api/v1/users", require("./routes/userRoute"));
app.use('/api/v1', require("./routes/transactionRoute")); 


const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

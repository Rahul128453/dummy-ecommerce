const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());


let orders = []; // store orders in memory

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("new-order", (data) => {

        orders.push(data); // save order

        console.log("Order received:", data);

        io.emit("order-notification", data);

    });

    socket.on("update-order-status", (data) => {

        orders = orders.map(order =>
            order.orderId === data.orderId
                ? { ...order, status: data.status }
                : order
        );

        io.emit("order-status-updated", data);

    });

});

app.get("/orders", (req, res) => {
    res.json(orders);
});

server.listen(5000, () => {
    console.log("Socket server running on port 5000");
});

app.post("/products", (req, res) => {
    const newProduct = {
        id: Date.now(),
        ...req.body
    };

    products.push(newProduct);

    res.json(newProduct);
});

app.use(express.json());
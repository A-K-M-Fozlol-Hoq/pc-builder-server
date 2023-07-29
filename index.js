require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `${process.env.DB_URI}`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("random_collections");
    const productCollection = db.collection("assignment_6_products");
    const categoryCollection = db.collection("categories");

    app.get("/productBySlug/:slug", async (req, res) => {
      const slug = req.params.slug;
      console.log({ slug });
      const cursor = productCollection.find({ categorySlug: slug });
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.get("/products/:id", async (req, res) => {
      const id = parseInt(req.params.id);

      // const result = await productCollection.findOne({ id: ObjectId(id) });
      const result = await productCollection.findOne({ id });
      res.send(result);
    });

    app.get("/featuredProducts", async (req, res) => {
      const cursor = productCollection.find({ isFeatured: true });
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.get("/featuredCategories", async (req, res) => {
      const cursor = categoryCollection.find({ isFeatured: true });
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post("/product", async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

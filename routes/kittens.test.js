const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const Kitten = require("../models/Kitten");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Testing for the kittens on a separate in-memory server", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });
    } catch (err) {
      console.error(err);
    }
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  beforeEach(async () => {
    const kittens = [
      { name: "Fluffy", age: 5, sex: "male" },
      { name: "Fluffier", age: 6, sex: "female" }
    ];
    await Kitten.create(kittens);
  });
  afterEach(async () => {
    await Kitten.deleteMany();
  });

  describe("[GET] all the kittens", () => {
    it("Should get all the kittens", async () => {
      const expectedKittens = [
        { name: "Fluffy", age: 5, sex: "male" },
        { name: "Fluffier", age: 6, sex: "female" }
      ];
      const { body: actualKittens } = await request(app)
        .get("/kittens")
        .expect(200);

      expectedKittens.forEach((kitten, index) => {
        expect(actualKittens[index]).toEqual(expect.objectContaining(kitten));
      });
    });
  });

  describe("[PUT] add a new kitten", () => {
    it("Should update a kitten", async () => {
      const newKitten = { name: "Muffin", age: 7, sex: "female" };
      return request(app)
        .put("/kittens/Fluffy")
        .send(newKitten)
        .expect(200)
        .expect(() => expect.objectContaining(newKitten));
    });
  });
  describe("[POST] add a new kitten", () => {
    it("Should add a new kitten", async () => {
      const newKitten = { name: "Muffin", age: 7, sex: "female" };
      return request(app)
        .post("/kittens/new")
        .send(newKitten)
        .expect(200)
        .expect(() => expect.objectContaining(newKitten));
    });
  });
  // describe("[DEL] should delete one kitten", () => {
  //   it("Should delete one kitten", async () => {
  //     const kittenToDelete = { name: "Fluffier", age: 6, sex: "female" };
  //     return request(app)
  //       .delete("/kittens/delete")
  //       .send(kittenToDelete)
  //       .expect(200)
  //       .expect("Successfully deleted kitten");
  //   });
  // });
});

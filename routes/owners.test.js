const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const Owner = require("../models/Owner");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Testing for the owners on a separate in-memory server", () => {
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
    const owners = [{ username: "jackblack", password: "pirate" }];
    await Owner.create(owners);
  });
  afterEach(async () => {
    await Owner.deleteMany();
  });
  describe("[POST] add a new owner", () => {
    it("Should add a new owner", async () => {
      const newOwner = {
        firstName: "Bob",
        lastName: "Dylan",
        salutation: "Mr",
        username: "bobdylan",
        password: "guitarist"
      };
      const { body: owner } = await request(app)
        .post("/owners/new")
        .send(newOwner)
        .expect(200);

      expect(owner.username).toBe("bobdylan");
      expect(owner.password).not.toBe("guitarist");
      expect(owner.firstName).toBe("Bob");
      expect(owner.lastName).toBe("Dylan");
      expect(owner.salutation).toBe("Mr");
    });
  });
  describe("[POST] Attemping to login an existing owner", () => {
    it("Should allow the owner to login if the password is correct", async () => {
      const existingOwner = {
        username: "jackblack",
        password: "pirate"
      };
      await request(app)
        .post("/owners/login")
        .send(existingOwner)
        .expect(200);
    });
    it("Should not allow the owner to login if the password is wrong", async () => {
      const existingOwner = {
        username: "jackblack",
        password: "wrongpassword"
      };
      await request(app)
        .post("/owners/login")
        .send(existingOwner)
        .expect(400);
    });
  });
  describe("[GET] Attempt to get all the existing owners", () => {
    it("Should return all the owners that have been registered", async () => {
      const expectedOwner = [
        {
          username: "jackblack"
        }
      ];
      const { body: actualOwners } = await request(app)
        .get("/owners")
        .expect(200);

      expectedOwner.forEach((owner, index) => {
        expect(actualOwners[index]).toEqual(expect.objectContaining(owner));
      });
    });
  });
  describe("[GET] /owners/secret - protected routes", () => {
    it("Denies access when owner is not authorized", async () => {
      await request(app)
        .get("/owners/secret")
        .expect(401);
    });
    it("Grants access when owner is authorized", async () => {
      await request(app)
        .get("/owners/secret")
        .set({ token: "watermelon" })
        .expect(200);
    });
  });
});

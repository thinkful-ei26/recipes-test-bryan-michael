const chai = require("chai");
const chaiHttp = require("chai-http")
const expect = chai.expect;

const { app, runServer, closeServer } = require("../server");

describe("Recipe list", function() {
  
  before(function () {
    return runServer();
  });
  
  after(function() {
    return closeServer();
  });

  it("should list recipes on GET", function() {
    return chai
      .request(app)
      .get("/recipes")
      .then(function(response) {
        expect(response).to.have.status(200);
        expect(response).to.be.json;
        expect(response.body).to.be.a("array");
        expect(response.body.length).to.be.at.least(2);
        const expectedKeys = ["name", "id", "ingredients"];
        response.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  it("should create a new recipe on POST", function() {
    const newItem = {name: "smoothie", ingredients: ["Fruit", "Milk", "Ice"]}
    return chai
    .request(app)
    .post("/recipes")
    .send(newItem)
    .then(function(response) {
      expect(response).to.have.status(201);
      expect(response).to.be.json;
      expect(response.body).to.include.keys("name", "id", "ingredients");
      expect(response.body.id).to.not.equal(null);
      expect(response.body).to.deep.equal(
        Object.assign(newItem, { id: response.body.id })
      );
    });
  });

  it("should update items on PUT", function() {
    const updateData = {
      "name": "bar",
      "ingredients": ["stick", "bar", "product"]
    };

    return (
      chai.request(app)
      .get("/recipes")
      .then(function(response) {
        updateData.id = response.body[0].id;
        return chai
        .request(app)
        .put(`/recipes/${updateData.id}`)
        .send(updateData);
      })
      .then(function(response) {
        expect(response).to.have.status(200);
        console.log(response);
        expect(response).to.be.json;
        expect(response).to.be.a("Object");
        expect(response.body).to.deep.equal(updateData);
      })
    );
  })

})
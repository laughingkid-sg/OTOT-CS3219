import chai, { assert } from "chai";
import chaiHttp from "chai-http";
import app from "../app";
import { ds, Portfolio } from "../db/";
require("dotenv").config();

// Configure chai
chai.use(chaiHttp);
chai.should();

const testData = {
    post : {
        quantity : 20.0,
        purchasePrice : 10000,
        coin : "bitcoin"
    }, 

    put: {
        id : "",
        quantity : 40.0,
        purchasePrice : 20000,
        coin : "ethereum"
    }
}

describe("Database", () => {
    describe("Await Connection to database", () => {
        it("should connect to database", (done) => {
            ds.initialize().then(() => done());
        }).timeout(10000);
    });
});

describe("Cyrpto Coins", () => {
    describe("GET /", () => {
        it("should get supported crypto coins", (done) => {
            chai.request(app)
                .get("/api/coin")
                .auth(process.env.BASIC_USERNAME!, process.env.BASIC_PASSWORD!)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                });
        });
    });
});

describe("Portfolio", () => {

    describe("POST /", () => {
        it("should create a new record in user's porfolio", (done) => {
            chai.request(app)
                .post("/api/portfolio")
                .send(testData.post)
                .auth(process.env.BASIC_USERNAME!, process.env.BASIC_PASSWORD!)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    testData.put.id = res.body.id;
                    done();
                });
        });
    });

    describe("GET /", () => {
        it("should get all record in user's porfolio", (done) => {
            chai.request(app)
                .get("/api/portfolio")
                .auth(process.env.BASIC_USERNAME!, process.env.BASIC_PASSWORD!)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");            
                    assert.isNotEmpty(res.body.portfolios);
                    const portfolios : Portfolio[] = res.body.portfolios
                    const insertedTestPortoflio = portfolios.find(portfolio => portfolio.id === testData.put.id);
                    assert.isNotEmpty(insertedTestPortoflio);
                    assert.equal(testData.post.quantity, insertedTestPortoflio?.quantity, "Quantity should be equal.");
                    assert.equal(testData.post.purchasePrice, insertedTestPortoflio?.purchasePrice, "Purchase price should be equal.");
                    assert.equal(testData.post.coin, insertedTestPortoflio?.coin.id, "Purchase price should be equal.");
                    done();
                });
        });
    });

    describe("PUT /", () => {
        it("should update the new record created in previous test", (done) => {
            chai.request(app)
                .put("/api/portfolio")
                .send(testData.put)
                .auth(process.env.BASIC_USERNAME!, process.env.BASIC_PASSWORD!)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    assert.equal(res.body.affected, 1, "One row should be updated")
                    done();
                });
        });
    });

    describe("DELETE /", () => {
        it("should delete the new record created in previous test", (done) => {
            chai.request(app)
                .delete("/api/portfolio")
                .send({id: testData.put.id})
                .auth(process.env.BASIC_USERNAME!, process.env.BASIC_PASSWORD!)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    assert.equal(res.body.affected, 1, "One row should be deleted")
                    done();
                });
        });
    });
});
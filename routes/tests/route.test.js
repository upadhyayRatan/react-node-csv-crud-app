const app = require("./server");
const supertest = require("supertest");

test("GET task/getTasks", async () => {
  await supertest(app).get("/task/getTasks").expect(200);
});


test("POST task/addTask", async () => {
  const payload = {
    id: "a69d54c2-909a-4670-8130-f8abcfe05146",
    text: "chess",
    day: "wed",
    description: "play",
    status: "yet to do",
  };
  await supertest(app)
    .post("/task/addTask")
    .send(payload)
    .set("Content-type", "application/json")
    .set("Accept", "application/json, text/plain")
    .expect(200);
});

test("PATCH task/updateTask", async () => {
    const payload = {
        id: "a69d54c1-909a-4670-8131-f8abcfe05146",
        text: "volleyball",
        day: "wed",
        description: "play",
        status: "Done",
      };
  await supertest(app)
    .patch("/task/updateTask")
    .send(payload)
    .set("Content-type", "application/json")
    .set("Accept", "application/json, text/plain")
    .expect(200)
});

test("DELETE task/deleteTask", async () => {
    const id='a69d54c2-909a-4670-8130-f8abcfe05146';
    await supertest(app)
      .delete(`/task/deleteTask/${id}`)
      .set("Content-type", "application/json")
      .set("Accept", "application/json, text/plain")
      .expect(200)
  });
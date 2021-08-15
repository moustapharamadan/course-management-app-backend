const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({
  static: "node_modules/json-server/public",
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  setTimeout(next, 0);
});

server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }
  next();
});

server.post("/courses/", function (req, res, next) {
  const error = validateCourse(req.body);
  console.log("Error server" + error);
  if (error) {
    res.status(400).send(error);
  } else {
    req.body.slug = createSlug(req.body.title); // Generate a slug for new courses.
    next();
  }
});

server.use(router);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});

function validateCourse(course) {
  console.log("Server side" + course);
  if (!course.title) return "Title is required.";
  if (!course.authorId) return "Author is required.";
  if (!course.category) return "Category is required.";
  return "";
}

function createSlug(value) {
  return value
    .replace(/[^a-z0-9_]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

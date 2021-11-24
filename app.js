//====================================================================//

const { server } = require("./server.js");

const { appLibFunctions } = require("./appLib.js");

const { validateUserLogin, generateToken } = appLibFunctions;

const { verifyToken, getAllStates, getState, getDistrict } = appLibFunctions;

const { addDistrict, deleteDistrict, updateDistrict, stats } = appLibFunctions;

//==========================SERVER CODE===============================//

server.post(
  "/login/",
  validateUserLogin,
  generateToken,
  async (req, res) => {}
);

server.get("/states/", verifyToken, getAllStates, async (req, res) => {});
server.get("/states/:stateId/", verifyToken, getState, async (req, res) => {});
server.get(
  "/districts/:districtId/",
  verifyToken,
  getDistrict,
  async (req, res) => {}
);
server.post("/districts/", verifyToken, addDistrict, async (req, res) => {});
server.delete(
  "/districts/:districtId/",
  verifyToken,
  deleteDistrict,
  async (req, res) => {}
);

server.put(
  "/districts/:districtId/",
  verifyToken,
  updateDistrict,
  async (req, res) => {}
);

server.get(
  "/states/:stateId/stats/",
  verifyToken,
  stats,
  async (req, res) => {}
);

//server.post("/login/gdt/", generateToken, async (req, res) => {});

//==========================SERVER CODE===============================//

module.exports = server;

//====================================================================//

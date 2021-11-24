//====================================================================//

const { getConnection, bcrypt, jwt } = require("./server.js");

let requestBody = null;

let queryParameters = null;

let databaseQuery = null;

let databaseResponseBody = null;

let jwtToken = null;

let responseBody = null;

let appLibFunctions = null;

//=========================SERVER FUNCTION============================//

const validateUserLogin = async (request, response, next) => {
  const { username, password } = request.body;
  databaseQuery = `SELECT * FROM user WHERE username = '${username}'`;
  let user = await databaseConnection.get(databaseQuery);
  if (user === undefined) {
    response.status(400);
    responseBody = "Invalid user";
  } else {
    let isValidUser = await bcrypt.compare(password, user.password);
    if (isValidUser) {
      next();
    } else {
      response.status(400);
      responseBody = "Invalid password";
    }
  }
  response.send(responseBody);
};

//=========================SERVER FUNCTION============================//

const generateToken = (request, response, next) => {
  const { username, password } = request.body;
  const payload = { username: username };
  const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
  responseBody = { jwtToken: jwtToken };
};

//=========================SERVER FUNCTION============================//

const verifyToken = (request, response, next) => {
  const header = request.headers["authorization"];
  if (header !== undefined) {
    jwtToken = header.split(" ")[1];
  }
  if (jwtToken !== undefined) {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        next();
      }
    });
  } else {
    response.status(401);
    response.send("Invalid JWT Token");
  }
};

//====================================================================//

const getAllStates = async (request, response, next) => {
  databaseQuery = "SELECT * FROM state";
  const states = await databaseConnection.all(databaseQuery);
  response.send(states.map((stateObject) => state(stateObject)));
};

//====================================================================//

const getState = async (request, response, next) => {
  const { stateId } = request.params;
  databaseQuery = `SELECT * FROM state WHERE state_id = ${stateId}`;
  const states = await databaseConnection.get(databaseQuery);
  response.send(state(states));
};

//====================================================================//

const getDistrict = async (request, response, next) => {
  const { districtId } = request.params;
  databaseQuery = `SELECT * FROM district WHERE district_id = ${districtId}`;
  const states = await databaseConnection.get(databaseQuery);
  response.send(district(states));
};

//====================================================================//

const addDistrict = async (request, response, next) => {
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  databaseQuery = `INSERT INTO district (district_name, state_id, cases, cured, active, deaths) VALUES('${districtName}', ${stateId},${cases},${cured},${active},${deaths})`;
  const states = await databaseConnection.run(databaseQuery);
  response.send("District Successfully Added");
};

//====================================================================//

const updateDistrict = async (request, response, next) => {
  const { districtId } = request.params;
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  databaseQuery = `UPDATE district SET district_name = '${districtName}', state_id = ${stateId}, cases = ${cases}, cured = ${cured}, active = ${active}, deaths = ${deaths} WHERE district_id = ${districtId}`;
  const states = await databaseConnection.run(databaseQuery);
  response.send("District Details Updated");
};

//====================================================================//

const stats = async (request, response, next) => {
  const { stateId } = request.params;
  databaseQuery = `SELECT sum(cases) as c, sum(cured) as u, sum(active) as a, sum(deaths) as d FROM district WHERE state_id = ${stateId}`;
  const states = await databaseConnection.get(databaseQuery);
  response.send(stat(states));
};

//====================================================================//

const deleteDistrict = async (request, response, next) => {
  const { districtId } = request.params;
  databaseQuery = `DELETE FROM district WHERE district_id = ${districtId}`;
  const states = await databaseConnection.run(databaseQuery);
  response.send("District Removed");
};

//====================================================================//

const state = (stateObject) => {
  return {
    stateId: stateObject.state_id,
    stateName: stateObject.state_name,
    population: stateObject.population,
  };
};

//====================================================================//

const district = (stateObject) => {
  return {
    districtId: stateObject.district_id,
    districtName: stateObject.district_name,
    stateId: stateObject.state_id,
    cases: stateObject.cases,
    cured: stateObject.cured,
    active: stateObject.active,
    deaths: stateObject.deaths,
  };
};

//====================================================================//

const stat = (stateObject) => {
  return {
    totalCases: stateObject.c,
    totalCured: stateObject.u,
    totalActive: stateObject.a,
    totalDeaths: stateObject.d,
  };
};

//====================================================================//

getConnection("covid19IndiaPortal.db").then((connection) => {
  databaseConnection = connection;
});

//====================================================================//

appLibFunctions = {
  validateUserLogin: validateUserLogin,
  generateToken: generateToken,
  verifyToken: verifyToken,
  getAllStates: getAllStates,
  getState: getState,
  getDistrict: getDistrict,
  addDistrict: addDistrict,
  deleteDistrict: deleteDistrict,
  updateDistrict: updateDistrict,
  stats: stats,
};

//====================================================================//

exports.appLibFunctions = appLibFunctions;

//====================================================================//

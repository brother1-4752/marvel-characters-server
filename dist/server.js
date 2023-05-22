"use strict";

require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.object.freeze.js");
require("core-js/modules/es.object.define-properties.js");
var _apolloServer = require("apollo-server");
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _templateObject;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
var typeDefs = (0, _apolloServer.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  type Query {\n    allMarvels: [character!]!\n    marvel(id: Int!): character\n  }\n\n  type items {\n    name: String!\n  }\n\n  type comic {\n    available: Int!\n    items: [items!]!\n  }\n\n  type thumb {\n    path: String!\n  }\n\n  type character {\n    id: String!\n    name: String!\n    description: String!\n    thumbnail: thumb\n    comics: comic\n  }\n"])));
var resolvers = {
  Query: {
    allMarvels: function allMarvels() {
      return (0, _nodeFetch["default"])("https://marvel-proxy.nomadcoders.workers.dev/v1/public/characters?limit=100&orderBy=modified&series=24229,1058,2023").then(function (response) {
        return response.json();
      }).then(function (json) {
        return json.data.results;
      });
    },
    marvel: function marvel(_, _ref) {
      var id = _ref.id;
      return (0, _nodeFetch["default"])("https://marvel-proxy.nomadcoders.workers.dev/v1/public/characters/".concat(id)).then(function (response) {
        return response.json();
      }).then(function (json) {
        return json.data.results;
      });
    }
  }
};
var server = new _apolloServer.ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers
});
server.listen().then(function (_ref2) {
  var url = _ref2.url;
  console.log("Running on ".concat(url));
});
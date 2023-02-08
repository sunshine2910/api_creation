// Permettre d'ajouter l'HATEOAS sur une route via un middleware
// useHATEOAS({
//   pagination: true, // Activate pagination links
//   links: { // Activate custom links
//       self: {},
//       update: {
//         type: "PUT",
//       },
//       videos: {
//         path: "/videos",
//       },
//   }
// });
module.exports = function Hateoas({ pagination, links }) {
  return (req, res, next) => {
    const resultat = res.render;
    res.render = (data) => {
      console.log("toto1")
      if (links) {
        console.log("if")
        if(Array.isArray(data)){
          data = {items: data};
        }
        data._links = Object.entries(links).reduce((accumulator, item) => {
          accumulator[item[0]] = {
            href:
              `${req.protocol}://${req.get("host")}${
                req.baseUrl
              }` + (item[1].path || ""),
            type: item[1].type || "GET",
          };
          return accumulator;
        }, {});
      }
      console.log("toto")
      resultat(data)
      console.log(data)
    };
    next();
  };
}

const buildFilter = (filter) => {
  const builtFilter = {};
  for (const key in filter) {
    if (filter[key] !== undefined && filter[key] !== "") {
      if (typeof filter[key] === "string") {
        builtFilter[key] = { $regex: filter[key], $options: "i" };
      } else {
        builtFilter[key] = filter[key];
      }
    }
  }

  return builtFilter;
};

export default buildFilter;

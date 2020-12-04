const https = require("https");

const PATTERN = /(\d+(\.\d+)?) +([a-zA-Z]{3}) +in +([a-zA-Z]{3})/;

const httpGet = (url) =>
  new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks = [];

      response.on("error", (error) => {
        reject(error);
      });

      response.on("data", (chunk) => {
        chunks.push(chunk.toString());
      });

      response.on("end", () => {
        resolve(chunks.join(""));
      });
    });
  });

module.exports = (pluginContext) => {
  const getExchangeRate = (currconvApiKey, source, dest) => {
    const query = `${source}_${dest}`;
    return httpGet(
      `https://free.currconv.com/api/v7/convert?apiKey=${currconvApiKey}&q=${query}&compact=y`
    )
      .then((text) => JSON.parse(text))
      .then((res) => res && res[query] && res[query].val);
  };

  const convert = (currconvApiKey, amount, source, dest) => {
    return getExchangeRate(currconvApiKey, source, dest).then(
      (rate) => amount * rate
    );
  };

  return {
    respondsTo: (query) => {
      return query.match(PATTERN);
    },
    search: (query, env = {}) => {
      if (!env.currconvApiKey) {
        return Promise.resolve([
          {
            title: "Zazu SuperPlugin",
            subtitle: "Please specify the currconvApiKey variable",
          },
        ]);
      }

      const queryParsed = query.match(PATTERN);
      const amount = parseFloat(queryParsed[1]),
        sourceCurrency = queryParsed[3].toUpperCase(),
        destCurrency = queryParsed[4].toUpperCase();

      return convert(
        env.currconvApiKey,
        amount,
        sourceCurrency,
        destCurrency
      ).then((result) => [
        {
          id: "1",
          icon: "fa-coins",
          title: `${amount} ${sourceCurrency} = ${result.toFixed(
            2
          )} ${destCurrency}`,
          value: result,
        },
      ]);
    },
  };
};

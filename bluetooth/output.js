const exec = require("../exec");

const setBluetoothMode = async (value) => {
  await exec(`/usr/local/bin/blueutil -p ${value ? 1 : 0}`);
};

module.exports = (_) => {
  return (value, _) => setBluetoothMode(value);
};

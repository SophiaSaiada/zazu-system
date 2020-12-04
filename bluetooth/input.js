const exec = require("../exec");

const getBluetoothMode = async () => {
  const { stdout } = await exec("/usr/local/bin/blueutil -p");
  return parseInt(stdout) === 1;
};

module.exports = (pluginContext) => {
  return (_, __) => {
    return getBluetoothMode().then((bluetoothIsOn) => [
      {
        icon: "fa-cogs",
        title: `Turn Bluetooth ${bluetoothIsOn ? "Off" : "On"}`,
        value: !bluetoothIsOn,
      },
    ]);
  };
};

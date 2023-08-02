const logList = document.getElementById("logList");

let knownLog = [];

export const setLogs = async (log) => {
  for (let logIndex = 0; logIndex < log.length; logIndex++) {
    if (!knownLog[logIndex]) {
      let elem = document.createElement("t-log");
      await uiBuilder.ready(elem);
      elem.component.setLog(log[logIndex].text, log[logIndex].time);
      logList.appendChild(elem);
    }
  }

  knownLog = log;
};

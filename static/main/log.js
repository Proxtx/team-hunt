const logList = document.getElementById("logList");

let knownLog = [];
let audio = new Audio("/lib/mp3/notification.mp3");

export const setLogs = async (log) => {
  if (log.length > knownLog.length) {
    audio.play();
  }
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

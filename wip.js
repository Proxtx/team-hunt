let ctx = new AudioContext();

let createAnalyzer = async () => {
  let stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  let mediaStreamSrc = ctx.createMediaStreamSource(stream);
  let analyzer = ctx.createAnalyser();
  //  analyzer.frequencyBinCount = 10000;
  let dataArray = new Uint8Array(analyzer.frequencyBinCount);
  mediaStreamSrc.connect(analyzer);
  return { analyzer, dataArray };
};

let result = await createAnalyzer();

//wait

let getByteData = (result) => {
  result.analyzer.getByteTimeDomainData(result.dataArray);
  return result.dataArray;
};

let byteData = getByteData(result);

let playDataArray = (dataArray) => {
  let audioBuffer = ctx.createBuffer(1, dataArray.length - 1, 22050);
  for (let r in dataArray) audioBuffer.getChannelData(0)[r] = dataArray[r];
  let source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  source.start();
};

playDataArray(byteData);

let playRepeat = async () => {
  playDataArray(getByteData(result));
  await new Promise((r) => setTimeout(r, 100));
  playRepeat();
};

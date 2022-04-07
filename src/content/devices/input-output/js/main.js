
/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

'use strict';

var image_array = [];

const videoElement = document.querySelector('video');
//const audioInputSelect = document.querySelector('select#audioSource');
//const audioOutputSelect = document.querySelector('select#audioOutput');
const videoSelect = document.querySelector('select#videoSource');
//const selectors = [audioInputSelect, audioOutputSelect, videoSelect];
const selectors = [videoSelect]
//audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    //if (deviceInfo.kind === 'audioinput') {
    //  option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
    //  audioInputSelect.appendChild(option);
    //} else if (deviceInfo.kind === 'audiooutput') {
    //  option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
    //  audioOutputSelect.appendChild(option);
    //} else if (deviceInfo.kind === 'videoinput') {
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }

  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

// Attach audio output device to video element using device/sink ID.
function attachSinkId(element, sinkId) {
  if (typeof element.sinkId !== 'undefined') {
    element.setSinkId(sinkId)
        .then(() => {
          console.log(`Success, audio output device attached: ${sinkId}`);
        })
        .catch(error => {
          let errorMessage = error;
          if (error.name === 'SecurityError') {
            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          }
          console.error(errorMessage);
          // Jump back to first output device in the list as it's the default.
          audioOutputSelect.selectedIndex = 0;
        });
  } else {
    console.warn('Browser does not support output device selection.');
  }
}

function changeAudioDestination() {
  const audioDestination = audioOutputSelect.value;
  attachSinkId(videoElement, audioDestination);
}

function getOrientation(){
  var orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
  return orientation;
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;

  console.log(stream)
  console.log( stream.getVideoTracks()[0].getSettings().width)
  // Refresh button list in case labels have become available
  var element = document.getElementById('video-box');
  var element2 = document.getElementById('vid'); 
  
  if (getOrientation() === "Landscape") {
    console.log(getOrientation())
    element.style.width = stream.getVideoTracks()[0].getSettings().width + "px";
    element.style.height=stream.getVideoTracks()[0].getSettings().height + "px";
    element2.style.width = element.style.width;
    element2.style.height = element.style.height;
  }
  else if (getOrientation()=== "Portrait"){
    console.log(getOrientation())
    element.style.width = stream.getVideoTracks()[0].getSettings().height + "px";
    element.style.height=stream.getVideoTracks()[0].getSettings().width + "px";
    element2.style.width = element.style.width;
    element2.style.height = element.style.height;
  }

  console.log("width"+ element.style.width);
  console.log("height" + element.style.height);
  console.log(navigator.mediaDevices.enumerateDevices());
  return navigator.mediaDevices.enumerateDevices();
  
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  //const audioSource = audioInputSelect.value;
  const videoSource = videoSelect.value;
  const constraints = {
    //audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}

//audioInputSelect.onchange = start;
//audioOutputSelect.onchange = changeAudioDestination;

videoSelect.onchange = start;

start();

function resize(){ 
  console.log('yo')
}

window.onresize = start



function take_snapshot(){
  var node = document.getElementById('caption');
  const video = document.querySelector('video');
const canvas = window.canvas = document.getElementById('mycanvas');
var thing  = document.getElementById('video-box');
console.log("button was clicked");

  canvas.width = thing.offsetWidth;
  canvas.height = thing.offsetHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  domtoimage.toPng(node)
    .then(function (dataUrl) {
  
        var img = new Image();
        img.src = dataUrl;
        img.onload = function(){
          canvas.getContext('2d').drawImage(img,0,0)
          
          requestAnimationFrame(() => {
            // This function will run in the next animation frame, *right before*
            // the browser will update the pixels on the display (paint).
      
              // To ensure that we run logic *after* the display has been
              // updated, an option is to queue yet one more callback
              // using setTimeout.
              setTimeout(() => {
                  // At this point, the page rendering has been updated with the
                  // `drawImage` result (or a later frame's result, see below).
                  var meme = new Image();
meme.id = 'pic';
var image_string = canvas.toDataURL();
meme.src= image_string;
image_array.push(image_string);
if (image_array.length > 5){ // added because localstorage limits the amount I can put in it, so I can only realistically save the last five pictures.
  image_array.shift();
}




var camera_roll = JSON.stringify(image_array);

window.localStorage.setItem("camera_roll", camera_roll);


//document.body.appendChild(meme);
var container = document.createElement('div');
container.appendChild(meme);
var referencenode =  document.getElementById('can')
referencenode.parentNode.insertBefore(container, referencenode.nextSibling);

              }, 0);
            });
          }
          

          


        
        
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });



}

var shutter = document.getElementById('vid')
var button = document.getElementById('snapshot')
button.onclick = take_snapshot

shutter.onclick = take_snapshot

//shutter.addEventListener('touchend', take_snapshot);

//shutter.addEventListener("touchend", tapHandler);

var tapedTwice = false;

function tapHandler(event) {
    if(!tapedTwice) {
        tapedTwice = true;
        setTimeout( function() { tapedTwice = false; }, 300 );
        return false;
    }
    event.preventDefault();
    //action on double tap goes below
    take_snapshot();
 }

 document.body.onload = function(){
  var saved_picture_string = window.localStorage.getItem('camera_roll');
  if (saved_picture_string === null){
    image_array = [];
  }
  else{
  console.log('saved_picture_string' + saved_picture_string)
  var saved_picture_array = JSON.parse(saved_picture_string);
  image_array = saved_picture_array;
  console.log(saved_picture_array.length);
  
  for (var i = 0; i<saved_picture_array.length; i++){
    console.log(i + " iiiiii");
    var meme = new Image();
meme.id = 'pic';
var image_string = saved_picture_array[i];
meme.src=image_string;
var container = document.createElement('div');
container.appendChild(meme);
var referencenode =  document.getElementById('can')
referencenode.parentNode.insertBefore(container, referencenode.nextSibling);

  }
}

 }

  // code that will run when the DOMContentLoaded event triggers  
//var meme = new Image();
//meme.id = 'pic';
//meme.src=canvas.toDataURL();
//document.body.appendChild(meme);

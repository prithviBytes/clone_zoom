const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

const myPeer = new Peer(undefined, {
	path: '/peerjs',
	host: '/',	
	port: '443'
})

let myVideoStream;
navigator.mediaDevices.getUserMedia({
	video: true
}).then(stream => {
	myVideoStream = stream;
	addVideoStream(myVideo, stream);
	
	myPeer.on("call", call => {
		call.answer(stream)
		const video = document.createElement('video')
		call.on('stream', userVideoStream => {
			addVideoStream(video, userVideoStream)
		})
	})
	
	socket.on("user-connected", (userId) => {
		connectToNewUser(userId, stream);
	})
})

myPeer.on("open", id=> {
	socket.emit("join-room", ROOM_ID, id);
}) 

const connectToNewUser = (userId, stream) => {
	const call = myPeer.call(userId,stream)
	const video = document.createElement('video')
	call.on('stream', userVideoStream => {
		addVideoStream(video, userVideoStream)
	})
}

const addVideoStream = (video,stream) => {
	video.srcObject = stream;
	video.addEventListener('loadedmetadata', () => {
		video.play();
	})
videoGrid.append(video);
}

let text = $('input');

$('html').keypress((e) =>{
	if(e.which == 13 && text.val().lenght !== 0){
		socket.emit('message',text.val());
		text.val('');
	}
})

socket.on('createMessage', message =>{
	$("ul").append(`<li class="message"><b>User: </b>${message}</li>`)
	scrollToBottom();
	})

const scrollToBottom = () => {
	let d = $('.main__chat__window')
	d.scrollTop(d.prop("scrollHeight"));
}

const playStop = () => {
	let enabled = myVideoStream.getVideoTracks()[0].enabled;
	if(enabled){
		setPlayButton();
		myVideoStream.getVideoTracks()[0].enabled = false;
	}else{
		setUnplayButton();
		myVideoStream.getVideoTracks()[0].enabled = true;
	}
}

const setPlayButton = () => {
const html = `<i class="stopped fas fa-video"></i><span>Play Video</span>`
document.querySelector(".video__button").innerHTML = html;
console.log("Plqay")
}

const setUnplayButton = () => {
const html = `<i class="fas fa-video-slash"></i><span>Stop Video</span>`
document.querySelector(".video__button").innerHTML = html;
}

// const muteUnmute = () => {
// 	const enabled = myVideoStream.getAudioTracks()[0].enabled;
// 	if(enabled){
// 		myVideoStream.getAudioTracks()[0].enabled = false;
// 		setUnmuteButton();
// 	}else{
// 		setMuteButton();
// 		myVideoStream.getAudioTracks()[0].enabled = true;
// 	}
// }

// const setMuteButton = () => {
// 	const html = `<i class="fas fa-microphone"></i><span>Mute</span>`
// 	$(".mute__button").innerHTML = html;
// }

// const setUnmuteButton = () => {
// 	const html = `<i class="stopped fas fa-microphone-slash"></i><span>Unmute</span>`
// 	$(".mute__button").innerHTML = html;
// }
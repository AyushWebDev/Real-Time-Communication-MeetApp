import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import queryString from 'query-string'
import RoomDetail from '../RoomDetail/RoomDetail';
import Chatbox from '../ChatBox/Chatbox';
import Input from '../Input/Input';
import './Room.css'
import WhiteBoard from '../components/container/whiteboard';
import ScrollToBottom from 'react-scroll-to-bottom';
<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" rel="stylesheet"></link>

// const Container = styled.div`
//     padding: 0px;
//     display: flex;
//     height: 100vh;
//     width: 90%;
//     background-color: black;
// `;

const StyledVideo = styled.video`
    width: 80%;
    height: 80%;
    border-radius: 10px;
    border: 2px solid #004d00;
    box-shadow: 2px 2px 5px;
    margin: 0px;
    background-color: black;
`;

const Video = ({key,peer}) => {
    const ref = useRef();

    useEffect(() => {
        peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = ({location}) => {
    console.log('in here');

    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const[chatbox,setChatbox]=useState([]);
    const[message,setMessage]=useState(''); 
    const {name,roomID}=queryString.parse(location.search);
    console.log(`room id= ${roomID}`)

    useEffect(() => {
        socketRef.current = io('localhost:8000');
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", {roomID,name});
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    useEffect(()=>{
        socketRef.current.on('message',(message)=>{
           setChatbox([...chatbox,message]);//push message in chatbox array
           console.log(chatbox);
        })
   },[chatbox]);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    const sendMessage=(event)=>{
        event.preventDefault();
        if(message){
            socketRef.current.emit('sendMessage',{message,name,roomID},()=>setMessage(''));
        }
    }
    console.log(message,chatbox);

    return (
        <div className="outerContainer">
             <div className="contain">
            <WhiteBoard/>
            </div>
         <div className="container vidcontainer">
         
            <div className="row">
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            </div>
            
            {peers.map((peer, index) => {
                return (
                    <div className="row">
                    
                        <Video key={index} peer={peer} /> 
                    
                    </div>  
                );
            })}

            
        </div>
       
        <div className="containing">
                <RoomDetail roomID={roomID}/>
                <Chatbox messages={chatbox} username={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}>
                </Input>
        </div>
        </div>
        
        
    );
};

export default Room;

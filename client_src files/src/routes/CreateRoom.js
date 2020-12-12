import React,{useState}from "react";
import {Link} from 'react-router-dom';
import { v1 as uuid } from 'uuid';
import './createroom.css';
import TextArea from "../TextArea/TextArea";

const CreateRoom = (props) => {
    const[name,setName]=useState('');
    const[room,setRoom]=useState('undefined');
    const roomID=uuid();
    const f=event=>{
        event.preventDefault();
        if(room==='undefined')
            {
                props.history.push(`/room?name=${name}&roomID=${roomID}`)
            }
        else
        {
            props.history.push(`/room?name=${name}&roomID=${room}`)
        }
    }
    return (
        <div className="joinOuterContainer">
        <div className="leftContainer">
        <div className="heading">Join Meeting</div>
            <div><input placeholder="Enter Username" className="joinInput mt-20" type="text" onChange={(event)=>setName(event.target.value)}/></div>
            <div><input placeholder="Enter Room No. Or Click Create" id="myroom"className="joinInput mt-20" type="text" onChange={(event)=>setRoom(event.target.value)} /></div>
            {/* <Link onClick={(event)=>(!name||!roomID||!room)?event.preventDefault():null} to={`/room?name=${name}&roomID=${roomID}`}>
            <button className="button mt-20" type="submit">Create room/Join Room</button>
            </Link> */}
            <button className="button mt-20" onClick={f}>Create room/Join Room</button>
        </div>
        <TextArea/>
        </div>
    );
}; 

export default CreateRoom;

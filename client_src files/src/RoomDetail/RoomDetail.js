import React from 'react'
import './RoomDetail.css';
import gmail from '../Icons/gmail.png'
import whatsapp from '../Icons/whatsapp.png'
import closeIcon from '../Icons/closeIcon.png';
import onlineIcon from '../Icons/onlineIcon.png';
const RoomDetail=({roomID})=>{
return (<div className="infoBar">
    <div className="leftInnerContainer">
        <img className="onlineIcon" src={onlineIcon}/>
        <h5>In Call Messages</h5>
    </div>
    <div className="rightInnerContainer">
        <table>
            <tr>
             <td><a href="https://mail.google.com/mail/u/0/#inbox?compose=new" target="_blank"><img src={gmail} height="20px" width="30px" margin="10px"  alt="Share room id"/></a></td>
            <td><a href="https://web.whatsapp.com/" target="_blank"><img src={whatsapp} height="20px" width="30px" margin="10px" alt="Share room id"/></a></td>
            <td><a href="/" > <img src={closeIcon}  height="20px" width="30px" margin="10px"  alt="Close Chat"/></a></td>
            </tr>
        </table>
    </div>
</div>);
}
export default RoomDetail;
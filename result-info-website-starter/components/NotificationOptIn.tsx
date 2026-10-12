"use client";
import { useState } from "react";
export default function NotificationOptIn(){
 const [state,setState]=useState("idle");
 async function enable(){
  if(!("Notification" in window)){setState("unsupported");return;}
  const permission=await Notification.requestPermission();
  if(permission!=="granted"){setState("denied");return;}
  setState("enabled");
  new Notification("Notifications enabled",{body:"This browser can show result updates while this site is open."});
 }
 return <div><button className="btn" onClick={enable}>{state==="enabled"?"✓ Notifications enabled":"Enable browser notifications"}</button>{state==="denied"&&<p className="small">Permission was not granted. You can enable it in browser site settings.</p>}{state==="unsupported"&&<p className="small">This browser does not support notifications.</p>}<p className="small" style={{marginTop:8,color:"#433a0c"}}>Browser permission is required. Background push notifications need additional server setup.</p></div>;
}
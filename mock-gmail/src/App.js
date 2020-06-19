import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
	const [emails,setEmails] = useState([])
	const [outgoing,setOutgoing] = useState([])
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [emailView, setemailView] = useState("Sending...");
	const [searchFilter, setsearchFilter] = useState("");
	const [response, setResponse] = useState(0);
	const [func, getFunction] = useState(sendMessage);
	const [pageView, setpageView] = useState("HOME");
	const [sort, setSort] = useState(false);
	const [url,setUrl] = useState("http://localhost:3001/emails")
	const [outgoingurl,setoutgoingUrl] = useState("http://localhost:3001/emails/search")
	useEffect(()=>{fetch(url).then(res=>res.json()).then(
		(result)=>{
			setIsLoaded(true);
			console.log(result)
			setEmails(result)
		},(error)=>{
			setIsLoaded(true);
			setError(error);
		}
	)
	},[url])
	
	var searchSubject = (filter,page) => {
		filter(document.getElementById("search").value);
		page("FILTERED");
	}
	
	var sortByDate = (sort,sortval) => {
		sort(!sortval)
		console.log("sort is now "+sortval)
	}
	
	var displaySidebar = () => {
		return (
	<React.Fragment>
		<input id="search" type="text"/>
		<button className="link" onClick={()=>{searchSubject(setsearchFilter,setpageView)}}>Submit</button>
		</React.Fragment>
	);
	}
	
	var sendMessage = (main,page) => {
		main("Sending email...");
		fetch("http://localhost:3001/send", {
		  method: "POST", 
		  headers: { 
        "Content-type": "application/json; charset=UTF-8"
		} ,
		body: JSON.stringify({sender:document.getElementById("from").value,recipient:document.getElementById("name").value,subject:document.getElementById("subject").value,message:document.getElementById("message").value})
		}).then(res => {
			page("SENTEMAIL")
		  console.log("Request complete! response:", res);
		  return res.json();
		}).then((result)=>{
			var finalMessage=(<React.Fragment><h2>{result.status[0].toUpperCase()+result.status.slice(1)+"!"}</h2>{result.message}</React.Fragment>);
			main(finalMessage)}
			);
	}
	
	var displayContent = () => {switch (pageView) {
		case "HOME":{
			return (
			<React.Fragment>
				<div className="row">
				<div className="col-2 header">
					Sender
				</div>
				<div className="col-3 header">
					Subject
				</div>
				<div className="col-5 header">
					Message
				</div>
				<div className="col-2 header link" onClick={()=>{sortByDate(setSort,sort)}}>
					Date
				</div>
				</div>
				{emails.sort((email1,email2)=>(sort)?Date.parse(email1.date)>Date.parse(email2.date):false).map((email,id)=>
					(<React.Fragment>
					
				<div className="row mt-0 mb-0 pt-0 pb-0 link" onClick={()=>{setemailView(id);setpageView("INDIVIDUAL")}}>
				<div className="col-2 text-nowrap overflow-hidden">
					{email.sender}
					</div>
				<div className="col-3 text-nowrap overflow-hidden">
					{email.subject}
					</div>
				<div className="col-5 text-nowrap overflow-hidden">
					{email.message}
					</div>
				<div className="col-2 text-nowrap overflow-hidden">
					{email.date}
					</div>
					</div>
					</React.Fragment>)
				)}
			</React.Fragment>
			)
		}
		case "INDIVIDUAL":{
			return(
			<React.Fragment>
				<h2>{emails[emailView].subject}</h2>
				<h4><b>To: </b>{emails[emailView].recipient}</h4>
				<h4><b>From: </b>{emails[emailView].sender}</h4>
				<h4><b>Sent on: </b>{emails[emailView].date}</h4>
				<hr/>
				{emails[emailView].message}
			</React.Fragment>
			);
		}break;
		case "SENDEMAIL":{
			return(<React.Fragment>
				<h2>Compose a New Email</h2>
				<h4><b>To: </b><input id="name" type="text"/></h4>
				<h4><b>From: </b><input id="from" type="text"/></h4>
				<h4><b>Subject: </b><input id="subject" type="text"/></h4>
				<hr/>
				<textarea className="verylarge" id="message" type="text" rows="10" cols="86" />
				<button className="link" onClick={()=>{sendMessage(setResponse,setpageView)}}>Send</button>
			</React.Fragment>)
		}
		case "SENTEMAIL":{
			return(<React.Fragment>
				{response}
			</React.Fragment>);
		}break;
		case "FILTERED":{
			return (
			<React.Fragment>
				<div className="row">
				<div className="col-2 header">
					Sender
				</div>
				<div className="col-3 header">
					Subject
				</div>
				<div className="col-5 header">
					Message
				</div>
				<div className="col-2 header link" onClick={()=>{sortByDate(setSort,sort)}}>
					Date
				</div>
				</div>
				{emails.sort((email1,email2)=>(sort)?Date.parse(email1.date)>Date.parse(email2.date):false).filter((email)=>email.subject.includes(searchFilter)).map((email,id)=>
					(<React.Fragment>
					
				<div className="row mt-0 mb-0 pt-0 pb-0 link" onClick={()=>{setemailView(id);setpageView("INDIVIDUAL")}}>
				<div className="col-2 text-nowrap overflow-hidden">
					{email.sender}
					</div>
				<div className="col-3 text-nowrap overflow-hidden">
					{email.subject}
					</div>
				<div className="col-5 text-nowrap overflow-hidden">
					{email.message}
					</div>
				<div className="col-2 text-nowrap overflow-hidden">
					{email.date}
					</div>
					</div>
					</React.Fragment>)
				)}
			</React.Fragment>
			)
		}break;
		case "SORTBYDATE":{
			return (
			<React.Fragment>
				<div className="row">
				<div className="col-2 header">
					Sender
				</div>
				<div className="col-3 header">
					Subject
				</div>
				<div className="col-5 header">
					Message
				</div>
				<div className="col-2 header link" onClick={()=>{sortByDate(setSort,sort)}}>
					Date
				</div>
				</div>
				{emails.sort((email1,email2)=>(sort)?Date.parse(email1.date)>Date.parse(email2.date):false).map((email,id)=>
					(<React.Fragment>
					
				<div className="row mt-0 mb-0 pt-0 pb-0 link" onClick={()=>{setemailView(id);setpageView("INDIVIDUAL")}}>
				<div className="col-2 text-nowrap overflow-hidden">
					{email.sender}
					</div>
				<div className="col-3 text-nowrap overflow-hidden">
					{email.subject}
					</div>
				<div className="col-5 text-nowrap overflow-hidden">
					{email.message}
					</div>
				<div className="col-2 text-nowrap overflow-hidden">
					{email.date}
					</div>
					</div>
					</React.Fragment>)
				)}
			</React.Fragment>
			)
		}break;
		default:{
			return(
				<div>???</div>
			)
		}
		}
	}
	
	  if (error) {
		return <div>Error: {error.message}</div>;
	  } else if (!isLoaded) {
		return <div>Loading...</div>;
	  } else if (emails.length === 0) {
		return <div>No data</div>;
	  } else {
	  return (
	  <React.Fragment>
		<div className="container-fluid">
		<div className="row mt-1">
			<div className="col-md-3"><img src="https://snipboard.io/V9jJTf.jpg"/></div>
			<div className="col-md-9">{displaySidebar()}</div>
		</div>
		<hr/>
		<div className="row">
		<div className="col-md-2 sidebar">
			<div className="sidebar_link centered link mt-4 mb-4" onClick={()=>{setpageView("SENDEMAIL")}}>+ COMPOSE</div>
			<div className="sidebar_link link" onClick={()=>{setpageView("HOME")}}>Inbox ({emails.length})</div>
			<div className="sidebar_link link">Sent Items ({outgoing.length})</div>
		</div>
		<hr/>
		<div className="col-md-10">
			{displayContent()}
		</div>
		</div>
		</div>
	   </React.Fragment>
	  );
	}
}

export default App;

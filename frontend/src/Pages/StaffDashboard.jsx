import React from 'react';
import { Link } from "react-router-dom";
import onlinelibrary from "../assets/onlineLibrary1.png";
import { useUser } from './usercontext';

function StaffDashboard() {
  const { state } = useUser();
  const { stfUserName, stfUserType} = state;
  const userData =JSON.parse(localStorage.getItem('userData'));
  const username = userData.username;
  
  const panelItems = [
    { key: 1, label: "Add Books", altText: "Add books to library", route: "/add-books" },
    { key: 2, label: "Book Search", altText: "Search for books", route: "/book-searchs" },
    { key: 3, label: "Register User", altText: "Update books information", route: "/RegistrationStaff" },
    { key: 4, label: "View Reservations", altText: "View current reservations", route: "/view-reservations" },
    { key: 5, label: "View Profile", altText: "View current profile", route: "/view-profile" },

  ];

console.log(username);
  return (
    <>
      <header className="main-container">
        <div className="background-overlay">
          <div className="title-container">
          <p>User Name: {username}</p>
              <p>User Type: {stfUserType}</p>
            <h1 className="main-title">Library Management System</h1>
          </div>
        </div>
      </header>
      <main className="content-area">
        <div className="buttons-container">
          {panelItems.slice(0, 5).map((item) => (
            <div key={item.key} className="button-container">
              <Link to={item.route}>
                <button className="panel-button">
                  {item.label}
                </button>
              </Link>
            </div>
          ))}
        </div>
        <div className="signout-container">
          <Link to="/Signout">
            <button className="panel-button signout-button">
              Signout
            </button>
          </Link>
        </div>
      </main>
      <style jsx>{`
        .main-container {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        .background-overlay {
          background: url(${onlinelibrary}) center/cover no-repeat;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0.8;
        }

        .title-container {
          margin-bottom: 40px;
          padding-top: 20px;
          z-index: 2;
          text-align: center;
        }

        .main-title {
          color: #fff;
          font-size: 75px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .content-area {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          z-index: 1;
        }

        .buttons-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          margin-bottom: 20px;
          padding-top: 100px;
        }

        .button-container {
          margin: 20px;
        }

        .panel-button {
          width: 150px;
          border-radius: 12px;
          box-shadow: 0 10px 4px rgba(0, 0, 0, 0.2);
          background-color: #af8f8f;
          color: #fff;
          padding: 20px;
          font-size: 20px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s;
        }

        .panel-button:hover {
          background-color: #795353;
          transform: scale(1.1);
        }

        .signout-container {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .signout-button {
          width: 200px;
          background-color: maroon;
          color: #fff;
        }

        @media (max-width: 768px) {
          .main-title {
            font-size: 40px;
          }

          .background-overlay {
            background-size: cover;
          }
        }
      `}</style>
    </>
  );
}

export default StaffDashboard;

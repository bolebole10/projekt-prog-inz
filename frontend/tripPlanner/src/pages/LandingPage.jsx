import React from "react";
import SearchComponent from "../components/SearchComponent";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="bg-gradient-to-br from-blue-100 via-teal-100 to-yellow-50 py-4">
        <div className="container mx-auto flex-1 flex flex-col px-6" style={{width: "90%"}}>
          <SearchComponent />
        </div>
      </section>
    </div>
  );
};




export default LandingPage;